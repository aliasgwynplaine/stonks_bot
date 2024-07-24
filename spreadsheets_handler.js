function create_new_spreadsheet(name, folder_id) {
  Logger.log(`Creating spreadsheet with name ${name} in folder ${folder_id}`)
  var folder = DriveApp.getFolderById(folder_id)
  folder_name = folder.getName()
  Logger.log(`Folder name: ${folder_name}`)
  var spreadsheet = SpreadsheetApp.create(name)
  var sheet = spreadsheet.getActiveSheet()
  sheet.setName("resumen")
  sheet.getActiveCell().setValue(`Este es el ${name}`).setFontWeight("bold")
  DriveApp.getFileById(spreadsheet.getId()).moveTo(folder)

  return spreadsheet
}


function create_new_sheet(title, spreadsheet) {
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
  sheet.appendRow(["Ingresos", "", "", "","Egresos"])
  sheet.appendRow(["monto", "observ", "fecha", "", "monto", "observ", "fecha", "tag"])
  var range = sheet.getRange("A1:F1")
  range.setFontWeight("bold")
  range = sheet.getRange("A2:I2")
  range.setFontWeight("bold")

  return sheet
}


function insert_income(raw, obs, tag) {
  var curr_sheet = getCurrSheet()
  var income_cell = curr_sheet.getRange(curr_sheet.getRange(income_ptr).getValue())
  income_cell = insert_entry(raw, obs, tag, income_cell)
  update_income_ptr(income_cell.getA1Notation(), curr_sheet)
}


function insert_outcome(raw, obs, tag) {
  var curr_sheet = getCurrSheet()
  var outcome_cell = curr_sheet.getRange(curr_sheet.getRange(outcome_ptr).getValue())
  outcome_cell = insert_entry(raw, obs, tag, outcome_cell)
  update_outcome_ptr(outcome_cell.getA1Notation(), curr_sheet)
}


function insert_entry(num, obs, tag, cell) {
  /**
   * @param {string} raw
   * @param {Range} cell
   */
  cell.setValue(num)
  cell.offset(0, 1).setValue(obs)
  cell.offset(0, 2).setValue(new Date())
  cell.offset(0, 3).setValue(tag)

  return cell.offset(1,0)
}


function getCurrSheet() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_ss_ptr).getValue())
  var curr_sheet = curr_spreadsheet.getSheetByName(ctrl_s.getRange(curr_s_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss
  delete curr_spreadsheet

  return curr_sheet
}


function getCurrSS() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_ss_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss

  return curr_spreadsheet
}


function getOutcomeCell() {
  var s = getCurrSheet()
  var outcome_cell = s.getRange(outcome_ptr)
  delete s

  return outcome_cell
}


function update_income_ptr(v, sheet) {
  sheet.getRange(income_ptr).setValue(v)
}


function update_outcome_ptr(v, sheet) {
  sheet.getRange(outcome_ptr).setValue(v)
}

function update_ptr_val(ptr, v, sheet) {
  sheet.getRange(ptr).setValue(v)
}


function get_sum_of_the_day() {
  var date = new Date()
  var curr_s = getCurrSheet()
  //var outcomes = curr_s.getRange("E3:"+ getOutcomeCell().getValue()).getValues()
  var outcomes = curr_s.getRange(
    "E3:"+ curr_s.getRange(getOutcomeCell().getValue()).offset(0,3).getA1Notation()
  ).getValues()
  outcomes.pop()
  var dayoutcome = outcomes.filter((outcome) => outcome[2].getDate() == date.getDate())
  var summm = 0

  for (let i = 0; i < dayoutcome.length; i++) {
    summm += dayoutcome[i][0]

  }

  return summm.toFixed(2)
}
