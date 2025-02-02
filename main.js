const gscript_props   = PropertiesService.getScriptProperties()
const user_props      = PropertiesService.getUserProperties()

const drive_folder_id = gscript_props.getProperty("folder_id") // manual
const telegram_token  = gscript_props.getProperty("telegram_token") // manual
const admins          = gscript_props.getProperty("admins") // manual
const passphrase      = gscript_props.getProperty("passphrase") // manual

// creado con launching()
const ctrl_ss_id      = gscript_props.getProperty("ctrl_id")
const curr_stonks_ss_ptr = gscript_props.getProperty("curr_stonks_ss_ptr")
const curr_journl_ss_ptr = gscript_props.getProperty("curr_journl_ss_ptr")
const curr_s_ptr      = gscript_props.getProperty("curr_s_ptr")
const income_ptr      = gscript_props.getProperty("income_ptr")
const outcome_ptr     = gscript_props.getProperty("outcome_ptr")
const shoplist_ptr    = gscript_props.getProperty("shoplist_ptr")
const shopcntr_ptr    = gscript_props.getProperty("shopcntr_ptr")
const journal_ptr     = gscript_props.getProperty("journal_ptr")
const food_ptr        = gscript_props.getProperty("food_ptr")
const todo_ptr        = gscript_props.getProperty("todo_ptr")
const todo_cntr       = gscript_props.getProperty("todo_cntr")
const beeper_ss_id    = gscript_props.getProperty("beeper_ss_id")
const shoplist_s_name = gscript_props.getProperty("shoplist_s_name")

// manually created
const verbosity       = user_props.getProperty("verbosity")

const url = `https://api.telegram.org/bot${telegram_token}`
console.log("Properties loaded.")
console.log(`income_ptr: ${income_ptr}`)
console.log(`outcome_ptr: ${outcome_ptr}`)
console.log(`folder_id: ${drive_folder_id}`)
console.log(`shoplist_ptr: ${shoplist_ptr}`)

const month = [
  "enero", "febrero", "marzo", "abril",
  "mayo" , "junio"  , "julio", "agosto",
  "setiembre", "octubre", "noviembre", "diciembre"
]

income_ptr_init_val  = "A5"
outcome_ptr_init_val = "G5"

function launching() {
  create_env()
  create_beeper()
  var d = new Date()
  var curr_year = d.getFullYear().toString()
  var ctrl_ss = create_ctrl()
  var stonks_spreadsheet = create_new_spreadsheet("balance-"+ curr_year, drive_folder_id)
  var stonks_sheet = create_new_stonks_sheet(month[d.getMonth()], stonks_spreadsheet)
  var journl_spreadsheet = create_new_spreadsheet("diario-"+ curr_year, drive_folder_id)
  var journl_sheet = create_new_journal_sheet(month[d.getMonth()], journl_spreadsheet)
  var ctrl_s  = ctrl_ss.getActiveSheet()
  ctrl_s.setName("env")
  ctrl_s.getRange(curr_stonks_ss_ptr).setValue(stonks_spreadsheet.getId())
  ctrl_s.getRange(curr_journl_ss_ptr).setValue(journl_spreadsheet.getId())
  ctrl_s.getRange(curr_s_ptr).setValue(stonks_sheet.getName())
  set_triggers()
}

function create_ctrl() {
  var folder = DriveApp.getFolderById(drive_folder_id)
  console.log("Creating ctrl spreadsheet")
  var ctrl_ss = SpreadsheetApp.create("ctrl")
  console.log("ctrl_id: ", ctrl_ss.getId())
  gscript_props.setProperty("ctrl_id", ctrl_ss.getId())
  DriveApp.getFileById(ctrl_ss.getId()).moveTo(folder)

  return ctrl_ss
}


function create_beeper() {
  var folder = DriveApp.getFolderById(drive_folder_id)
  console.log("Creating beeper spreadsheet")
  var beeper_ss = SpreadsheetApp.create("beeper")
  console.log("beeper_id: ", beeper_ss.getId())
  gscript_props.setProperty("beeper_ss_id", beeper_ss.getId())
  DriveApp.getFileById(beeper_ss.getId()).moveTo(folder)
  var shopsheet = beeper_ss.getActiveSheet()
  shopsheet.setName("compras")
  gscript_props.setProperty("shoplist_s_name", "compras")
  shopsheet.getRange(shoplist_ptr).setValue("A1")
  shopsheet.getRange(shopcntr_ptr).setValue(0)

  return beeper_ss
}


function create_env() {
  /* ctrl env vars */
  gscript_props.setProperty("curr_stonks_ss_ptr", "B1")
  gscript_props.setProperty("curr_journl_ss_ptr", "B2")
  gscript_props.setProperty("curr_s_ptr", "B3")
  /* stonks env vars */
  gscript_props.setProperty("income_ptr", "B1")
  gscript_props.setProperty("outcome_ptr", "B2")
  /* journal env vars*/
  gscript_props.setProperty("journal_ptr", "B1")
  gscript_props.setProperty("food_ptr", "B2")
  gscript_props.setProperty("todo_ptr", "B3")
  gscript_props.setProperty("todo_cntr", "B4")
  gscript_props.setProperty("shoplist_ptr", "N1")
  gscript_props.setProperty("shopcntr_ptr", "N2")

}

// todo: email functions
function emailReport(e) {
  //todo: check email using regex

  MailApp.sendEmail({
    to: "dummy@mail.com",
    subject: "Report",
    htmlBody: 
    "\npostData.contents: "+ e.postData.contents +
    "\npathInfo: "+ e.pathInfo
  });
}


function getbeeperss() {
  // used in todo.js and shopping.js
  return SpreadsheetApp.openById(beeper_ss_id)
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

