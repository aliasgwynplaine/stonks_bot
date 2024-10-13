const gscript_props   = PropertiesService.getScriptProperties()
const user_props      = PropertiesService.getUserProperties()
const drive_folder_id = gscript_props.getProperty("folder_id") // manual
const ctrl_ss_id      = gscript_props.getProperty("ctrl_id") // creado con launching()
const telegram_token  = gscript_props.getProperty("telegram_token") // manual
const curr_ss_ptr     = gscript_props.getProperty("curr_ss_ptr")
const curr_s_ptr      = gscript_props.getProperty("curr_s_ptr")
const income_ptr      = gscript_props.getProperty("income_ptr")
const outcome_ptr     = gscript_props.getProperty("outcome_ptr")
const shoplist_ptr    = gscript_props.getProperty("shoplist_ptr")
const todolist_ptr    = gscript_props.getProperty("todolist_ptr")
const shopcntr_ptr    = gscript_props.getProperty("shopcntr_ptr")
const todocntr_ptr    = gscript_props.getProperty("todocntr_ptr")
const beeper_ss_id    = gscript_props.getProperty("beeper_ss_id")
const shoplist_s_name = gscript_props.getProperty("shoplist_s_name")
const todolist_s_name = gscript_props.getProperty("todolist_s_name")
const verbosity       = user_props.getProperty("verbosity")
Logger.log("Properties loaded.")
Logger.log(`income_ptr: ${income_ptr}`)
Logger.log(`outcome_ptr: ${outcome_ptr}`)
Logger.log(`folder_id: ${drive_folder_id}`)
Logger.log(`shoplist_ptr: ${shoplist_ptr}`)
Logger.log(`todolist_ptr: ${todolist_ptr}`)

// used in todo.js and shopping.js
const beeper_ss  = SpreadsheetApp.openById(beeper_ss_id)

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
  ScriptApp.newTrigger("showdaily")
  .timeBased().atHour(21).nearMinute(30).everyDays(1).create()

  ScriptApp.newTrigger("showshoppinglist")
  .timeBased().atHour(17).nearMinute(30).everyDays(1).create()

  ScriptApp.newTrigger("showshoppinglist")
  .timeBased().atHour(12).nearMinute(3).everyDays(1).create()

  ScriptApp.newTrigger("showshoppinglist")
  .timeBased().atHour(8).nearMinute(2).everyDays(1).create()
}


function showdailyreport() {
  var sumoday = get_sum_of_the_day()
  var text = "*Reporte diario*\n"
  text += "Gasto de hoy: "+ Math.abs(sumoday)
  var users = admins.split(',')

  for (let i = 0; i < users.length; i++) {
    sendMessage(text, users[i].trim())
  }
}


function showshoppinglist() {
  var list = shop()

  if (typeof list != 'string') {
    text = "Hay cosas en tu lista de compras!\n"
    text += "\nSi ya has comprado todo, usa /shopclear."

    var users = admins.split(',')

    for (let i = 0; i < users.length; i++) {
      sendMessage(text, users[i].trim())
      sendInlineKeyboardMarkup("*Shopping*", list, users[i].trim())
    }
  }

}


function is_new_years_eve() {
  var date = new Date();
  var ctrl_ss = SpreadsheetApp.openById(ctrl_ss_id)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  var curr_spreadsheet = getCurrSS()

  if (date.getMonth() === 0) {
    curr_spreadsheet = create_new_spreadsheet("balance-"+ date.getFullYear().toString(), drive_folder_id)
    ctrl_s.getRange(curr_ss_ptr).setValue(curr_spreadsheet.getId())
    // todo: reporte anual
  }

  var curr_sheet = create_new_sheet(month[date.getMonth()], curr_spreadsheet)
  ctrl_s.getRange(curr_s_ptr).setValue(curr_sheet.getName())
  update_income_ptr("A3", curr_sheet)
  update_outcome_ptr("E3", curr_sheet)
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

function create_env() {
  gscript_props.setProperty("income_ptr", "N1")
  gscript_props.setProperty("outcome_ptr", "N2")
}

// todo: email functions
function emailReport(e) {
  //todo: check email using regex

  MailApp.sendEmail({
    to: "naro.leonrios@gmail.com",
    subject: "Report",
    htmlBody: "parameter: "+ e.parameter+
    "\nparameters: "+e.parameters +
    "\npostData.contents: "+ e.postData.contents
  });
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