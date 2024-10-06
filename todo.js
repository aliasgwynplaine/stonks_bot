const todolist_s = beeper_ss.getSheetByName(todolist_s_name)

function processTodolist(prompt) {
  if (prompt.indexOf("/todoadd")   == 0) return todoadd(prompt)
  if (prompt.indexOf("/todoclear") == 0) return todoclear()
  if (prompt.indexOf("/todolist")  == 0) return todolist()
}

function todoadd(prompt) {
  return listadd(prompt, todolist_s, todolist_ptr, todocntr_ptr)
}

function todoclear() {
  return listclear(todolist_s, todolist_ptr, todocntr_ptr)
}

function todolist() {
  return showlist(todolist_s, todolist_ptr, "To-do")
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
