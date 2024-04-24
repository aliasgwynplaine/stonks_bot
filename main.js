const gscript_props   = PropertiesService.getScriptProperties()
const drive_folder_id = gscript_props.getProperty("folder_id")
const ctrl_ss_id      = gscript_props.getProperty("ctrl_id") // creado con launching()
const telegram_token  = gscript_props.getProperty("telegram_token")
const curr_ss_ptr     = gscript_props.getProperty("curr_ss_ptr")
const curr_s_ptr      = gscript_props.getProperty("curr_s_ptr")
const income_ptr      = gscript_props.getProperty("income_ptr")
const outcome_ptr     = gscript_props.getProperty("outcome_ptr")
Logger.log("Properties loaded.")
Logger.log(`income_ptr: ${income_ptr}`)
Logger.log(`outcome_ptr: ${outcome_ptr}`)
Logger.log(`folder_id: ${drive_folder_id}`)

const month = [
  "enero", "febrero", "marzo", "abril",
  "mayo" , "junio"  , "julio", "agosto",
  "setiembre", "octubre", "noviembre", "diciembre"
]

// Triggers

function set_triggers() {
  var triggers = ScriptApp.getProjectTriggers()
  Logger.log(triggers)
  
  for (let i = 0; i < triggers.length; i++)
    ScriptApp.deleteTrigger(triggers[i])

  create_monthly_trigger()
  create_daily_trigger()
}

function create_monthly_trigger() {
  ScriptApp.newTrigger("is_new_years_eve")
  .timeBased().onMonthDay(1).atHour(0).create()
}


function create_daily_trigger() {
  ScriptApp.newTrigger("is_21h30")
  .timeBased().atHour(21).nearMinute(30).everyDays(1).create()
}


function is_21h30() {
  var sumoday = get_sum_of_the_day()
  var text = "*Reporte diario*\n"
  text += "Gasto de hoy: "+ Math.abs(sumoday)
  var users = admins.split(',')

  for (let i = 0; i < users.length; i++) {
    sendMessage(text, users[i].trim())
  }
}


function is_new_years_eve() {
  var date = new Date();
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()

  if (date.getMonth() === 0) {
    var curr_spreadsheet = create_new_spreadsheet("balance-"+ date.getFullYear().toString(), drive_folder_id)
    ctrl_s.getRange(curr_ss_ptr).setValue(curr_spreadsheet.getId())
    // todo: reporte anual
  }

  var curr_sheet = create_new_sheet(month[date.getMonth()], curr_spreadsheet)
  ctrl_s.getRange(curr_s_ptr).setValue(curr_sheet.getName())
  // todo: reporte mensual
}


function launching() {
  var d = new Date()
  var curr_year = d.getFullYear().toString()
  create_ctrl()
  var ctrl_ss_id = gscript_props.getProperty("ctrl_id")
  var curr_spreadsheet = create_new_spreadsheet("balance-"+ curr_year, drive_folder_id)
  var curr_sheet = create_new_sheet(month[d.getMonth()], curr_spreadsheet)
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  ctrl_s.getRange(curr_ss_ptr).setValue(curr_spreadsheet.getId())
  ctrl_s.getRange(curr_s_ptr).setValue(curr_sheet.getName())
  update_income_ptr("A3", curr_sheet)
  update_outcome_ptr("E3", curr_sheet)
  set_triggers()
}

function create_ctrl() {
  var folder = DriveApp.getFolderById(drive_folder_id)
  Logger.log("Creating ctrl spreadsheet")
  var ctrl_ss = SpreadsheetApp.create("ctrl")
  Logger.log("ctrl_id: ", ctrl_ss.getId())
  gscript_props.setProperty("ctrl_id", ctrl_ss.getId())
  DriveApp.getFileById(ctrl_ss.getId()).moveTo(folder)
}

function oldtests() {
  var d = new Date()
  var curr_year = d.getFullYear().toString()
  console.log("here")
  var curr_spreadsheet = create_new_spreadsheet("balance-"+ curr_year, drive_folder_id)
  var curr_sheet = create_new_sheet(month[d.getMonth()], curr_spreadsheet)
  var income_cell = curr_sheet.getRange(income_ptr)
  var outcome_cell = curr_sheet.getRange(outcome_ptr)
  console.log(`income_cell_val: ${income_cell.getValue()}`)
  console.log(`outcome_cell_val: ${outcome_cell.getValue()}`)
  income_cell.setValue("A3")
  update_outcome_ptr("E3", curr_sheet)
  console.log(`income_cell_val: ${income_cell.getValue()}`)
  console.log(`outcome_cell_val: ${outcome_cell.getValue()}`)
  update_income_ptr(income_cell.offset(1, 0).getA1Notation(), curr_sheet)
  update_outcome_ptr("E4", curr_sheet)
  console.log(`income_cell_val: ${income_cell.getValue()}`)
  console.log(`outcome_cell_val: ${outcome_cell.getValue()}`)


  console.log("done")
}
