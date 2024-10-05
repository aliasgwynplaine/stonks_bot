function processTodolist(prompt, mssg_id, user_id) {
  if (prompt.indexOf("/todoadd")   == 0) return todoadd(prompt, mssg_id, user_id)
  if (prompt.indexOf("/todoclear") == 0) return todoclear()
  if (prompt.indexOf("/todolist")  == 0) return todolist()
  if (prompt.indexOf("/tododone")  == 0) return tododone(prompt, mssg_id, user_id)
}

function todoadd(prompt, mssg_id, user_id) {
  var idx  = prompt.indexOf(" ")
  var items = prompt.substring(idx,).split(",")
  var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
  var todolist_s = beeper_ss.getSheetByName(todolist_s_name)
  var cell = todolist_s.getRange(todolist_s.getRange(todolist_ptr).getValue())
  for (let i = 0; i < items.length; i++) {
    console.log(items[i])
    cell.setValue(items[i].trim())
    cell.offset(0, 1).setValue(mssg_id)
    cell.offset(0, 2).setValue(user_id)
    cell = cell.offset(1,0)
  }
  update_ptr_val(todolist_ptr, cell.getA1Notation(), todolist_s)

  return "tarea agregada"
}

function todoclear() {
  var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
  var todolist_s = beeper_ss.getSheetByName(todolist_s_name)
  update_ptr_val(todolist_ptr, "A1", todolist_s)
  todolist_s.getRange("A:C").clear()

  return "Tareas eliminadas!"
}

function todolist() {
  var list = get_todolist()
  Logger.log(list)
  //sendMessage("processing...", admins)
  var r = "*To-do list*\n"

  for (let i = 0; i < list.length; i++) {
    r += "+ "+ list[i][0].trim() +"\n"
  }

  Logger.log(r)
  return r
}


function tododone(prompt, mssg_id, user_id) {

}


function get_todolist() {
  var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
  var todolist_s = beeper_ss.getSheetByName(todolist_s_name)
  var cell = todolist_s.getRange(todolist_s.getRange(todolist_ptr).getValue())

  var list =  todolist_s.getRange("A1:"+ cell.getA1Notation()).getValues()
  list.pop()

  return list
}


function todoaddtest() {
  Logger.log("testing todoadd...")
  sendMessage(processUpdate("/todoadd tarea1"), admins)
  sendMessage(processUpdate("/todoadd colada!!"), admins)
  sendMessage(processUpdate("/todoadd mira la lista de compras?"), admins)
  sendMessage(processUpdate("/todoadd mejorar el bot"), admins)
  sendMessage(processUpdate("/todoadd archi , aaaa , farmacia "), admins)
  Logger.log("Done!")
}

function todocleartest() {
  Logger.log("testing todoclear...")
  sendMessage(processUpdate("/todoclear"), admins)
  Logger.log("Done!")
}

function todolisttest() {
  Logger.log("testing todolist...")
  sendMessage(processUpdate("/todolist"), admins)
  Logger.log("Done!")
}
