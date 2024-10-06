const shoplist_s = beeper_ss.getSheetByName(shoplist_s_name)

function processShoplist(prompt) {
  if (prompt.indexOf("/shopadd")   == 0) return shopadd(prompt)
  if (prompt.indexOf("/shopclear") == 0) return shopclear()
  if (prompt.indexOf("/shoplist")  == 0) return shoplist()
  if (prompt.indexOf("/shop") == 0)      return shop()
}

function shop() {
  let t =  getrawlist(shoplist_s, shoplist_ptr)

  if (t.length == 0) return "*Lista vacía*"

  return t
}

function shopadd(prompt) {
  var idx  = prompt.indexOf(" ")
  var items = prompt.substring(idx,).split(",")

  return listadd(items, shoplist_s, shoplist_ptr, shopcntr_ptr)
}

function shopdel(idx) {
  return listdel(shoplist_s, idx, shoplist_ptr, shopcntr_ptr)
}

function shopclear() {
  return listclear(shoplist_s, shoplist_ptr, shopcntr_ptr)
}

function shoplist() {
  return showlist(shoplist_s, shoplist_ptr, "Lista de compras")
}


function shopaddtest() {
  Logger.log("testing shopadd...")
  processTextUpdate("/shopadd arroz")
  processTextUpdate("/shopadd caramelos")
  processTextUpdate("/shopadd    miel")
  processTextUpdate("/shopadd arroz integral")
  processTextUpdate("/shopadd arroz quemado, gelatina , queso ")
  Logger.log("Done!")
}

function shopcleartest() {
  Logger.log("testing shopclear...")
  sendMessage(processTextUpdate("/shopclear"), admins)
  Logger.log("Done!")
}

function shoplisttest() {
  Logger.log("testing shoplist...")
  sendMessage(processTextUpdate("/shoplist"), admins)
  Logger.log("Done!")
}

