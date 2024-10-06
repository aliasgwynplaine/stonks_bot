function listadd(prompt, sheet, entry_ptr, entry_cntr) {
  var idx  = prompt.indexOf(" ")
  var items = prompt.substring(idx,).split(",")
  console.log(items)
  console.log(entry_ptr)
  var cell = sheet.getRange(sheet.getRange(entry_ptr).getValue())
  var cnt  = parseInt(sheet.getRange(entry_cntr).getValue())

  for (let i = 0; i < items.length; i++) {
    console.log(items[i])
    cell.setValue(items[i].trim())
    cell.offset(0, 1).setValue(++cnt)
    cell = cell.offset(1,0)
  }

  update_ptr_val(entry_ptr, cell.getA1Notation(), sheet)
  update_ptr_val(entry_cntr, cnt, sheet)

  return "agregado"
}

function listclear(sheet, entry_ptr, entry_cntr) {
  update_ptr_val(entry_ptr, "A1", sheet)
  update_ptr_val(entry_cntr, 0, sheet)
  sheet.getRange("A:B").clear()

  return "Lista eliminada. No olvides registrar tus gastos!"
}

function showlist(sheet, entry_ptr, title) {
  var list = getrawlist(sheet, entry_ptr)
  Logger.log(list)
  //sendMessage("processing...", admins)
  if (title !== undefined) var r = "*"+ title +"*"
  else var r = "*Lista*"

  for (let i = 0; i < list.length; i++) {
    r += "\n+ "+ list[i][0].trim()
  }

  if (list.length == 0) return r +" *vacía*."
  Logger.log(r)
  return r
}


function getrawlist(sheet, entry_ptr) {
  var cell = sheet.getRange(sheet.getRange(entry_ptr).getValue())
  var list =  sheet.getRange("A1:"+ cell.getA1Notation()).getValues()
  list.pop()

  return list
}
