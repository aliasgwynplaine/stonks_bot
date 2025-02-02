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
    ScriptApp.newTrigger("showdailyreport")
    .timeBased().atHour(23).nearMinute(30).everyDays(1).create()
  
    ScriptApp.newTrigger("showtodolist")
    .timeBased().atHour(21).nearMinute(20).everyDays(1).create()
  
    ScriptApp.newTrigger("showshoppinglist")
    .timeBased().atHour(16).nearMinute(30).everyDays(1).create()
  
    ScriptApp.newTrigger("showtodolist")
    .timeBased().atHour(18).nearMinute(3).everyDays(1).create()
  
    ScriptApp.newTrigger("showshoppinglist")
    .timeBased().atHour(17).nearMinute(27).everyDays(1).create()
  
    ScriptApp.newTrigger("showshoppinglist")
    .timeBased().atHour(8).nearMinute(2).everyDays(1).create()
  
    ScriptApp.newTrigger("showtodolist")
    .timeBased().atHour(6).nearMinute(0).everyDays(1).create()
  
    ScriptApp.newTrigger("exportJournalOfTheDay")
    .timeBased().atHour(23).nearMinute(45).everyDays(1).create()
  
    ScriptApp.newTrigger("cleanJournalTodoList")
    .timeBased().atHour(0).nearMinute(3).everyDays(1).create()
  }
  
  
  function showdailyreport() {
    var sumoday = get_sum_of_the_day() 
    var text = "*Reporte diario*\n"
    text += "Gasto de hoy: "+ Math.abs(sumoday)
    var users = admins.split(',')
  
    for (let i = 0; i < users.length; i++) {
      sendMessage(text, users[i].trim())
    }
    if (sumoday > 0) {
      insert_tot(sumoday)
    } 
  }
  
  
  function showtodolist() {
    var list = processJournalTodo("")
  
    if (typeof list != 'string') {
      text = "No olvides lo que tienes que hacer!\n"
  
      var users = admins.split(',')
  
      for (let i = 0; i < users.length; ++i) {
        sendMessage(text, users[i].trim())
        sendInlineKeyboardMarkup("*To-do*", list, users[i].trim())
      }
    }
  }
  
  
  function showshoppinglist() {
    var list = shop("")
  
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
    var curr_stonks_spreadsheet = getCurrStonksSS()
    var curr_journl_spreadsheet = getCurrJournalSS()
  
    if (date.getMonth() === 0) {
      curr_stonks_spreadsheet = create_new_spreadsheet("balance-"+ date.getFullYear().toString(), drive_folder_id)
      ctrl_s.getRange(curr_stonks_ss_ptr).setValue(curr_stonks_spreadsheet.getId())
      curr_journl_spreadsheet = create_new_spreadsheet("diario-"+ date.getFullYear().toString(), drive_folder_id)
      ctrl_s.getRange(curr_journl_ss_ptr).setValue(curr_journl_spreadsheet.getId())
      // todo: reporte anual
    }
  
    var curr_stonks_sheet = create_new_stonks_sheet(month[date.getMonth()], curr_stonks_spreadsheet)
    create_new_journal_sheet(month[date.getMonth()], curr_journl_spreadsheet)
    ctrl_s.getRange(curr_s_ptr).setValue(curr_stonks_sheet.getName())
  
    // todo: reporte mensual
  }
  
  