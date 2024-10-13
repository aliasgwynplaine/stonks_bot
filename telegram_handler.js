const url = `https://api.telegram.org/bot${telegram_token}`
const admins = gscript_props.getProperty("user_admin")


function doPost(e) {
  if (!e.postData || !e.postData.contents) {
    return;
  }

  const update   = JSON.parse(e.postData.contents)
  //sendPlainText(update, admins)

  var message = null
  var chat_id
  var user_id
  var username

  if (update.callback_query) {
    chat_id  = update.callback_query.message.chat.id
    user_id  = update.callback_query.from.id
    username = update.callback_query.from.username

    if (!verify_privs(user_id)) {
      sendMessage(`Sorry. You're not in the list`, chat_id)
      sendMessage(`@${username} [${user_id}] has knocked the door.`, admins)
      return
    }

    const callback_q = update.callback_query

    const msg = processCallbackQueryUpdate(callback_q, chat_id)
    if (msg !== null) sendMessage(msg, chat_id)
    return
  }

  if (update.message){
    chat_id  = update.message.chat.id
    user_id  = update.message.from.id
    mssg_id  = update.message.message_id
    username = update.message.from.username

    if (!verify_privs(user_id)) {
      sendMessage(`Sorry. You're not in the list`, chat_id)
      sendMessage(`@${username} [${user_id}] has knocked the door.`, admins)
      return
    } /*else {
      sendMessage(`* ${username} [${user_id}], You are in the list!!`, chat_id)
    }*/

    const updateText = update.message.text

    if (!updateText || updateText.toString().trim().length === 0) {
      sendMessage(`Huh?`, chat_id)
      return;
    }

    message = processTextUpdate(updateText, mssg_id, user_id)
  }

  console.log(`r: ${message}.`)

  if (message === null) sendMessage("huh?", chat_id)
  else {
    if (verbosity == "1") sendMessage(message, chat_id)
    else setEmojiReaction("👍", mssg_id, chat_id)
  } 

}

function processTextUpdate(prompt, mssg_id, user_id) {
  // here will come the magik!
  console.log("processing update")
  const re_expend = /[+-]?([0-9]*[.])?[0-9]+,.+,?.*/
  var m = prompt.match(re_expend)

  if (m !== null) return processExpenditure(prompt, mssg_id, user_id)
  
  const re_shoplist = /\/\bshop(add|clear|list|){1}\b(\s)*(\w)*/
  m = prompt.match(re_shoplist)

  console.log("proceding with shoplist processing")
  if (m !== null) {
    const r = processShoplist(prompt)

    if (typeof r == 'string') return r

    sendInlineKeyboardMarkup("*Shopping*", r, user_id)

    return "Toca las opciones para eliminarlas!"
  }

  const re_todolist = /\/\btodo(add|clear|list|){1}\b(\s)*(\w)*/
  m = prompt.match(re_todolist)

  console.log("proceding with todolist processing")

  if (m !== null) {
    const r = processTodolist(prompt)

    if (typeof r == 'string') return r

    sendInlineKeyboardMarkup("*To-do*", r, user_id)
    
    return "Toca las opciones para completar las tareas!"
  }

  const re_verbosity = /\/\bverbosity\b(\s)*(\w){1}/
  m = prompt.match(re_verbosity)

  if (m !== null) {
    idx = prompt.indexOf(" ")
    user_props.setProperty("verbosity", prompt.substring(idx, ).trim())
    return "Ok"
  }

  console.log("returning null")


  return null
}


function processCallbackQueryUpdate(callback_query, chat_id) {
  var idx = parseInt(callback_query.data)
  var l   = null

  if (callback_query.message.text == "To-do") {
    tododel(idx)
    l = todo("")
  }

  if (callback_query.message.text == "Shopping") {
    shopdel(idx)
    l = shop("")
  }

  if (typeof l == 'string') {
    editInlineKeyboardMarkup(callback_query.message.message_id, [], chat_id)
    return l
  }

  editInlineKeyboardMarkup(callback_query.message.message_id, l, chat_id)

  return null
}


function verify_privs(user_id) { // todo: real auth
  if (user_id.length === 0) return false
  
  if (admins.indexOf(user_id) === -1) { // lol
    return false
  }

  return true
}


function hrdcdd_scp_chrs(text) {
  return text
  .replace(/\_/g, '\\_')
  .replace(/\*/g, '\\*')
  .replace(/\[/g, '\\[')
  .replace(/\]/g, '\\]')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')
  .replace(/\~/g, '\\~')
  .replace(/\`/g, '\\`')
  .replace(/\>/g, '\\>')
  .replace(/\#/g, '\\#')
  .replace(/\+/g, '\\+')
  .replace(/\-/g, '\\-')
  .replace(/\=/g, '\\=')
  .replace(/\|/g, '\\|')
  .replace(/\{/g, '\\{')
  .replace(/\}/g, '\\}')
  .replace(/\./g, '\\.')
  .replace(/\!/g, '\\!')
}


function sendPlainText(text, chat_id) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      text,
      chat_id,
    }),
  }

  const response = UrlFetchApp.fetch(url+"/sendMessage", options)
  const content = response.getContentText()
  
  if (!response.getResponseCode().toString().startsWith('2')) {
    console.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


function sendMessage(text, chat_id) {
  //text = hrdcdd_scp_chrs(text)
  console.log(text)
  let parse_mode = "markdown"
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      text,
      chat_id,
      parse_mode,
    }),
  }

  const response = UrlFetchApp.fetch(url+"/sendMessage", options)
  const content = response.getContentText()
  
  if (!response.getResponseCode().toString().startsWith('2')) {
    console.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


 function sendInlineKeyboardMarkup(text, tcl, chat_id) {
  let parse_mode = "markdown"
  let buttons    = []

  for (let i = 0; i < tcl.length; i++) {
    buttons[i] = [{text: tcl[i][0], callback_data: tcl[i][1]}]
  }

  let reply_markup = {
    inline_keyboard : buttons
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      text,
      chat_id,
      parse_mode,
      reply_markup,
    }),
  }

  const response = UrlFetchApp.fetch(url+"/sendMessage", options)
  const content = response.getContentText()
  
  if (!response.getResponseCode().toString().startsWith('2')) {
    Logger.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


function editInlineKeyboardMarkup(message_id, tcl, chat_id) {
  let parse_mode = "markdown"
  let buttons    = []

  for (let i = 0; i < tcl.length; i++) {
    buttons[i] = [{text: tcl[i][0], callback_data: tcl[i][1]}]
  }

  let reply_markup = {
    inline_keyboard : buttons
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      message_id,
      chat_id,
      parse_mode,
      reply_markup,
    }),
  }

  const response = UrlFetchApp.fetch(url+"/editMessageReplyMarkup", options)
  const content = response.getContentText()
  
  if (!response.getResponseCode().toString().startsWith('2')) {
    Logger.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


function setEmojiReaction(react, message_id, chat_id) {
  // "👍"
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      chat_id,
      message_id,
      reaction: [{type: "emoji", emoji: react}],
    }),
  }

  const response = UrlFetchApp.fetch(url+"/setMessageReaction", options)
  const content = response.getContentText()
  
  if (!response.getResponseCode().toString().startsWith('2')) {
    console.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


function test_sendInlineKeyboardMarkup() {
  sendInlineKeyboardMarkup("test", admins)
}


// Webhook stuff: 
function registerWebhook() {
  var webhookurl = url +"/getWebhookInfo"
  console.log(webhookurl)
  let response = UrlFetchApp.fetch(webhookurl)
  let content = response.getContentText()
  let jsn = JSON.parse(content)
  
  if (!jsn.result || jsn.result.url.trim().length > 0) {
    console.log(jsn)
    return
  }

  console.log("webhook info done")

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      //url: ScriptApp.getService().getUrl(),
      url: "https://script.google.com/macros/s/AKfycbyHi_pDCjpyXuD2jfsHg67X_k6q_vwnGHSE0wSZrOk2e58b0IThyEP9ZlyOHJJECkBLXg/exec",
      allowed_updates: ["message", "edited_channel_post", "callback_query", "message_reaction", "edited_message"]
    }),
  }
  response = UrlFetchApp.fetch(url+"/setWebhook", options)
  content = response.getContentText()
  console.log(content)
}


function getWebhookInfo() {
  var webhookurl = url +"/getWebhookInfo"
  console.log(webhookurl)
  let response = UrlFetchApp.fetch(webhookurl)
  let content = response.getContentText()
  let jsn = JSON.parse(content)
  console.log(jsn)

}

function delWebhook() {
  var delwebhookurl = url +"/deleteWebhook"
  console.log(delwebhookurl)
  let response = UrlFetchApp.fetch(delwebhookurl)
  let content  = response.getContentText()
  let jsn = JSON.parse(content)
  console.log(jsn)
}
