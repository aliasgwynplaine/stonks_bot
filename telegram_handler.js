const url = `https://api.telegram.org/bot${telegram_token}`
const admins = gscript_props.getProperty("user_admin")


function doPost(e) {
  if (!e.postData || !e.postData.contents) {
    return;
  }

  const update   = JSON.parse(e.postData.contents)
  sendPlainText(update, admins)
  const chat_id  = update.message.chat.id
  const user_id  = update.message.from.id
  const mssg_id  = update.message.message_id
  const username = update.message.from.username
  
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

  const message = processUpdate(updateText, mssg_id, user_id)
  console.log(`r: ${message}.`)
  if (message === null) sendMessage(`huh?`, chat_id)
  else sendMessage(message, chat_id) 
}

function processUpdate(prompt, mssg_id, user_id) {
  // here will come the magik!
  Logger.log("processing update")
  const re_expend = /[+-]?([0-9]*[.])?[0-9]+,.+,?.*/
  var m = prompt.match(re_expend)

  if (m !== null) return processExpenditure(prompt, mssg_id, user_id)
  
  const re_shoplist = /\/\bshop(add|clear|list){1}\b(\s)*(\w)*/
  m = prompt.match(re_shoplist)

  Logger.log("proceding with shoplist processing")
  if (m !== null) return processShoplist(prompt)

  const re_todolist = /\/\btodo(add|clear|list){1}\b(\s)*(\w)*/
  m = prompt.match(re_todolist)

  Logger.log("proceding with todolist processing")
  if (m !== null) return processTodolist(prompt)
  Logger.log("returning null")


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
    Logger.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}


function sendMessage(text, chat_id) {
  //text = hrdcdd_scp_chrs(text)
  Logger.log(text)
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
    Logger.log(content);
  }

  return ContentService.createTextOutput('OK').setMimeType(
    ContentService.MimeType.TEXT
  )
}

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
