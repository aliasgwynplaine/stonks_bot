const shoplist_s = beeper_ss.getSheetByName(shoplist_s_name)

function processShoplist(prompt) {
  if (prompt.indexOf("/shopadd")   == 0) return shopadd(prompt)
  if (prompt.indexOf("/shopclear") == 0) return shopclear()
  if (prompt.indexOf("/shoplist")  == 0) return shoplist()
}

function shopadd(prompt) {
  return listadd(prompt, shoplist_s, shoplist_ptr, shopcntr_ptr)
}

function shopclear() {
  return listclear(shoplist_s, shoplist_ptr, shopcntr_ptr)
}

function shoplist() {
  return showlist(shoplist_s, shoplist_ptr, "Lista de compras")
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

