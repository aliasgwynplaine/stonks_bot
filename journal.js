var journal_h = {
  "diary" : ["datetime", "diario", "msg_id", "usr_id"],
  "food"  : ["datetime", "comida", "msg_id", "usr_id"],
  "todo"  : ["datetime", "todo", "id", "stat", "msg_id", "usr_id"]
}

var journal_cntrs = [
  "todo"
]

function create_new_journal_sheet(title, spreadsheet) {
  /**
   * @param {string} title 
   * @param {Spreadsheet} spreadsheet
   * @returns {Sheet} sheet
   */
  console.log(`Creating sheet with title ${title} in spreadsheet ${spreadsheet}`)
  var ss = spreadsheet
  ss_id = ss.getId()
  console.log(`ss id: ${ss_id}`)
  name = ss.getName()
  console.log(`spreadsheet name: ${name}.`)
  var sheet = ss.insertSheet(title)
  var l = Object.keys(journal_h).length

  for (let i = 0; i < l; i++) {
    sheet.appendRow([Object.keys(journal_h)[i]+"_ptr"])
  }

  for (let i = 0; i < journal_cntrs.length; i++) {
    sheet.appendRow([journal_cntrs[i] + "_cntr", 0])
  }

  var l_str = (l + journal_cntrs.length + 1).toString()
  sheet.appendRow(Object.values(journal_h).flat())
  var range = sheet.getRange(l_str+":"+l_str)
  range.setFontWeight("bold")
  range = sheet.getRange("B1")
  trang = sheet.getRange("A"+(l + journal_cntrs.length + 2).toString());

  for (let i = 0; i < l; i++) {
    range.offset(i, 0).setValue(trang.getA1Notation())
    trang = trang.offset(0, Object.values(journal_h)[i].length)
  }

  sheet.hideRows(1,l + journal_cntrs.length)

  return sheet
}


function processJournal(prompt, mssg_id, user_id) {
  var entry = []
  var sheet = getCurrJournalSheet()
  var cell  = sheet.getRange(sheet.getRange(journal_ptr).getValue())
  entry.push(prompt)
  entry.push(mssg_id)
  entry.push(user_id)
  cell = insert_entry(entry, cell)
  update_ptr_val(journal_ptr, cell.getA1Notation(), sheet)

  return "Entrada agregada al diario"
}


function processFood(prompt, mssg_id, user_id) {
  var idx   = prompt.indexOf(" ")
  var entry = []
  var sheet = getCurrJournalSheet()
  var cell  = sheet.getRange(sheet.getRange(food_ptr).getValue())
  entry.push(prompt.substring(idx, ))
  entry.push(mssg_id)
  entry.push(user_id)
  cell = insert_entry(entry, cell)
  update_ptr_val(food_ptr, cell.getA1Notation(), sheet)

  return "Comida agregada al diario"
}


function processJournalTodo(prompt, mssg_id, user_id) {
  var idx = prompt.indexOf(" ")
  
  if (idx == -1) {
    t = getTodoRawList()

    if (t.length == 0) return "*No hay nada en la lista de tareas*"

    return processTodoRawList(t)
  }

  items = prompt.substring(idx, ).split(",")
  var sheet = getCurrJournalSheet()
  var cell  = sheet.getRange(sheet.getRange(todo_ptr).getValue())
  var cnt   = parseInt(sheet.getRange(todo_cntr).getValue())
  var c = 0
 
  for (let i = 0; i < items.length; i++) {
    if (items[i].trim().length == 0) continue
    let entry = []
    entry.push(items[i])
    entry.push(++cnt)
    entry.push(0) // 0: incomplete, 1: complete, 2: canceled
    entry.push(mssg_id)
    entry.push(user_id)
    cell = insert_entry(entry, cell)
    c++
  }

  update_ptr_val(todo_ptr, cell.getA1Notation(), sheet)
  sheet.getRange(todo_cntr).setValue(cnt)

  return `Se agregaron ${c} entradas a la lista de tareas.`
}


function processTodoToggle(idx) {
  var date = new Date()
  var l = Object.keys(journal_h).length
  var sheet = getCurrJournalSheet()
  var ptrA1 = sheet.getRange(todo_ptr).getValue()
  var cell  = sheet.getRange(ptrA1)
  var i = 0

  for (; parseInt(cell.offset(i, 2).getValue()) != idx; i--) { /* empty */ }

  cell = cell.offset(i, 3)
  cell.setValue((parseInt(cell.getValue()) + 1) % 3)
}


function cleanJournalTodoList() {
  var date = new Date()
  var l = Object.keys(journal_h).length
  var sheet = getCurrJournalSheet()
  var ptrA1 = sheet.getRange(todo_ptr).getValue()
  var cell  = sheet.getRange(ptrA1)
  var i = -1
  console.log(cell.offset(-1,0).getValue().getDate())

  for (; parseInt(cell.offset(i, 2).getValue()) > 0; i--) {
    var s = parseInt(cell.offset(i, 3).getValue())
    if (s == 1 || s == 2)
      cell.offset(i, 2).setValue(-1)
  }
}


function processTodoRawList(tl) {
  t = []

  for (let i = 0; i < tl.length; i++) {
    var e = ""
    var s = parseInt(tl[i][3])

    if (s == 0) 
      e += "⬜️ "+ tl[i][1]
    else if (s == 1)
      e += "✅ "+ tl[i][1]
    else 
      e += "❌ "+ tl[i][1]
    
    t.push([e, tl[i][2]])
  }

  return t
}


function getTodoRawList() {
  var date = new Date()
  var l = Object.keys(journal_h).length
  var sheet = getCurrJournalSheet()
  var ptrA1 = sheet.getRange(todo_ptr).getValue()
  var cells = sheet.getRange(
    ptrA1[0]+(l + journal_cntrs.length + 2).toString()+":"+ 
    sheet.getRange(ptrA1).offset(0,journal_h['todo'].length).getA1Notation()
  ).getValues()
  cells.pop()

  var fromtoday = cells.filter((cell) => cell[0].getDate() == date.getDate() || parseInt(cell[3]) == 0)

  return fromtoday
}


function exportJournalOfTheDay(){
  var content = ""
  var folder  = DriveApp.getFolderById(drive_folder_id)
  var date = new Date()
  content += date.getDate().toString() +"-"
  content += date.getMonth().toString() +"-"
  content += date.getFullYear().toString()
  var filename = content + ".md"
  content = "# "+ content +"\n"
  var l = Object.keys(journal_h).length
  var sheet = getCurrJournalSheet()
  var ptrA1 = sheet.getRange(journal_ptr).getValue()
  var cells = sheet.getRange(
    ptrA1[0]+(l + journal_cntrs.length + 2).toString()+":"+ 
    sheet.getRange(ptrA1).offset(0,journal_h['diary'].length).getA1Notation()
  ).getValues()
  cells.pop()
  var fromtoday = cells.filter((cell) => cell[0].getDate() == date.getDate())
  content += "\n## Diario\n"

  for (let i = 0; i < fromtoday.length; i++) {
    content += fromtoday[i][0].getHours().toString() +":"+ fromtoday[i][0].getMinutes() +" "
    content += fromtoday[i][1] + "\n"
  }

  content += "\n## Comida\n"
  ptrA1 = sheet.getRange(food_ptr).getValue()
  cells = sheet.getRange(
    ptrA1[0]+(l + journal_cntrs.length + 2).toString()+":"+ 
    sheet.getRange(ptrA1).offset(0,journal_h['food'].length).getA1Notation()
  ).getValues()
  cells.pop()

  fromtoday = cells.filter((cell) => cell[0].getDate() == date.getDate())

  for (let i = 0; i < fromtoday.length; i++) {
    content += fromtoday[i][0].getHours().toString() +":"+ fromtoday[i][0].getMinutes() +" "
    content += fromtoday[i][1] + "\n"
  }

  content += "\n## To-do\n"
  ptrA1 = sheet.getRange(todo_ptr).getValue()
  cells = sheet.getRange(
    ptrA1[0]+(l + journal_cntrs.length + 2).toString()+":"+ 
    sheet.getRange(ptrA1).offset(0,journal_h['todo'].length).getA1Notation()
  ).getValues()
  cells.pop()

  fromtoday = cells.filter((cell) => cell[0].getDate() == date.getDate() || parseInt(cell[3]) == 0)

  for (let i = 0; i < fromtoday.length; i++) {
    var s = parseInt(fromtoday[i][3])
    if (s == 0)
      content += "[ ] "
    else if (s == 1) 
      content += "[x] "
    else continue
    content += fromtoday[i][1] + "\n"
  }

  var file = folder.createFile(filename, content)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  sendDocument(file, "Encuentra el diario del día aquí <3", admins)

  file.setTrashed(true)

  return null
}


function test_processFood() {
  processFood("/comida laksjdflasjñdfaklsjdñf adf  adsf a ")
}

function test_processJournalTodo() {
  processJournalTodo("/todo hola, amigo")
  console.log(processJournalTodo("/todo"))
}

function test_processTodoToggle() {
  processTodoToggle(4)
}


