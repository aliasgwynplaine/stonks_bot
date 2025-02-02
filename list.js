function listadd(items, sheet, entry_ptr, entry_cntr) {
  var cell = sheet.getRange(sheet.getRange(entry_ptr).getValue())
  var cnt  = parseInt(sheet.getRange(entry_cntr).getValue())
  var c    = 0;

  for (let i = 0; i < items.length; i++) {
    console.log(items[i])
    if (items[i].trim().length == 0) continue
    cell.setValue(items[i].trim())
    cell.offset(0, 1).setValue(++cnt)
    cell = cell.offset(1,0)
    c++;
  }

  update_ptr_val(entry_ptr, cell.getA1Notation(), sheet)
  update_ptr_val(entry_cntr, cnt, sheet)

  return `Se agregaron ${c} elementos.`
}


function listdel(sheet, idx, entry_ptr, entry_cntr) {
  var cell = sheet.getRange(sheet.getRange(entry_ptr).getValue())
  var cntr = sheet.getRange(entry_cntr).getValue()
  var v    = sheet.getRange("A1:"+ cell.offset(0,1).getA1Notation()).getValues()
  v.pop()

  for (let i = 0; i < v.length; i++) {
    if (v[i][1] == idx) {
      sheet.deleteRow(i + 1) // row starts at 1
      update_ptr_val(entry_ptr, cell.offset(-1,0).getA1Notation(), sheet)
      update_ptr_val(entry_cntr, cntr, sheet)

      return i + 1
    }
  }

  return 0
}


function listclear(sheet, entry_ptr, entry_cntr) {
  update_ptr_val(entry_ptr, "A1", sheet)
  update_ptr_val(entry_cntr, 0, sheet)
  sheet.getRange("A:B").clear()

  return "Lista eliminada."
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
  var list =  sheet.getRange("A1:"+ cell.offset(0,1).getA1Notation()).getValues()
  list.pop()

  return list
}
