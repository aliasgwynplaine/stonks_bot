function create_new_spreadsheet(name, folder_id) {
  console.log(`Creating spreadsheet with name ${name} in folder ${folder_id}`)
  var folder = DriveApp.getFolderById(folder_id)
  folder_name = folder.getName()
  console.log(`Folder name: ${folder_name}`)
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

  return sheet
}

function update_ptr_val(ptr, v, sheet) {
  sheet.getRange(ptr).setValue(v)
}


function getCurrStonksSheet() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_stonks_ss_ptr).getValue())
  var curr_sheet = curr_spreadsheet.getSheetByName(ctrl_s.getRange(curr_s_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss
  delete curr_spreadsheet

  return curr_sheet
}


function getCurrStonksSS() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_stonks_ss_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss

  return curr_spreadsheet
}


function getCurrJournalSheet() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_journl_ss_ptr).getValue())
  var curr_sheet = curr_spreadsheet.getSheetByName(ctrl_s.getRange(curr_s_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss
  delete curr_spreadsheet

  return curr_sheet
}


function getCurrJournalSS() {
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = SpreadsheetApp.openById(ctrl_s.getRange(curr_journl_ss_ptr).getValue())
  delete ctrl_s
  delete ctrl_ss

  return curr_spreadsheet
}


