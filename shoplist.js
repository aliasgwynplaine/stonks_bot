function processShoplist(prompt) {
    if (prompt.indexOf("/shopadd")   == 0) return shopadd(prompt)
    if (prompt.indexOf("/shopclear") == 0) return shopclear()
    if (prompt.indexOf("/shoplist")  == 0) return shoplist()
  }
  
  function shopadd(prompt) {
    var idx  = prompt.indexOf(" ")
    var items = prompt.substring(idx,).split(",")
    console.log(items)
    var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
    var shoplist_s = beeper_ss.getSheetByName(shoplist_s_name)
    var cell = shoplist_s.getRange(shoplist_s.getRange(shoplist_ptr).getValue())
    for (let i = 0; i < items.length; i++) {
      console.log(items[i])
      cell.setValue(items[i].trim())
      cell = cell.offset(1,0)
    }
    update_ptr_val(shoplist_ptr, cell.getA1Notation(), shoplist_s)
  
    return "agregado"
  }
  
  function shopclear() {
    var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
    var shoplist_s = beeper_ss.getSheetByName(shoplist_s_name)
    update_ptr_val(shoplist_ptr, "A1", shoplist_s)
    shoplist_s.getRange("A:A").clear()
  
    return "Lista eliminada\. No olvides registrar tus gastos\\!"
  }
  
  function shoplist() {
    var list = get_shoplist()
    Logger.log(list)
    //sendMessage("processing...", admins)
    var r = "*Lista de compras*\n"
  
    for (let i = 0; i < list.length; i++) {
      r += "\\+ "+ list[i][0].trim() +"\n"
    }
  
    Logger.log(r)
    return r
  }
  
  
  function get_shoplist() {
    var beeper_ss = SpreadsheetApp.openById(beeper_ss_id)
    var shoplist_s = beeper_ss.getSheetByName(shoplist_s_name)
    var cell = shoplist_s.getRange(shoplist_s.getRange(shoplist_ptr).getValue())
  
    var list =  shoplist_s.getRange("A1:"+ cell.getA1Notation()).getValues()
    list.pop()
  
    return list
  }
  
  
  function shopaddtest() {
    Logger.log("testing shopadd...")
    processUpdate("/shopadd arroz")
    processUpdate("/shopadd caramelos")
    processUpdate("/shopadd    miel")
    processUpdate("/shopadd arroz integral")
    processUpdate("/shopadd arroz quemado, gelatina , queso ")
    Logger.log("Done!")
  }
  
  function shopcleartest() {
    Logger.log("testing shopclear...")
    sendMessage(processUpdate("/shopclear"), admins)
    Logger.log("Done!")
  }
  
  function shoplisttest() {
    Logger.log("testing shoplist...")
    sendMessage(processUpdate("/shoplist"), admins)
    Logger.log("Done!")
  }
  
  