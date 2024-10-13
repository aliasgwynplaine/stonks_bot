const todolist_s = beeper_ss.getSheetByName(todolist_s_name)

function processTodolist(prompt) {
  if (prompt.indexOf("/todoadd")   == 0) return todoadd(prompt)
  if (prompt.indexOf("/todoclear") == 0) return todoclear()
  if (prompt.indexOf("/todolist")  == 0) return todolist()
  if (prompt.indexOf("/todo") == 0)      return todo(prompt)
}

function todo(prompt) {
  var idx   = prompt.indexOf(" ")
  
  if (idx == -1) {
    let t =  getrawlist(todolist_s, todolist_ptr)

    if (t.length == 0) return "*Lista vacía*"

    return t
  }
  
  var items = prompt.substring(idx, ).split(",")
  return listadd(items, todolist_s, todolist_ptr, todocntr_ptr)
}

function todoadd(prompt) {
  var idx   = prompt.indexOf(" ")
  var items = prompt.substring(idx,).split(",")

  return listadd(items, todolist_s, todolist_ptr, todocntr_ptr)
}

function tododel(idx) {
  return listdel(todolist_s, idx, todolist_ptr, todocntr_ptr)
}
 
function todoclear() {
  return listclear(todolist_s, todolist_ptr, todocntr_ptr)
}
 
function todolist() {
  return showlist(todolist_s, todolist_ptr, "To-do")
}

function testtodo() {
  return processTextUpdate("/todo", null, admins)
}

function testtododel() {
  sendMessage(`tododel: ${tododel(2)}`, admins)
}

function todoaddtest() {
  Logger.log("testing todoadd...")
  sendMessage(processTextUpdate("/todoadd tarea1"), admins)
  sendMessage(processTextUpdate("/todoadd colada!!"), admins)
  sendMessage(processTextUpdate("/todoadd mira la lista de compras?"), admins)
  sendMessage(processTextUpdate("/todoadd mejorar el bot"), admins)
  sendMessage(processTextUpdate("/todoadd archi , aaaa , farmacia "), admins)
  Logger.log("Done!")
}

function todocleartest() {
  Logger.log("testing todoclear...")
  sendMessage(processTextUpdate("/todoclear"), admins)
  Logger.log("Done!")
}

function todolisttest() {
  Logger.log("testing todolist...")
  sendMessage(processTextUpdate("/todolist"), admins)
  Logger.log("Done!")
}
