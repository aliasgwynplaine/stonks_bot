var flippy = true

function get_flippy() {
  return `flippy: ${flippy}`
}

function flip_flippy() {
  flippy = flippy ^ true
  return `flippy: ${flippy}`
}

function test_flippy() {
  sendMessage(processUpdate("/flippy"), admins)
}

function test_props() {
  var uprops = PropertiesService.getUserProperties()
  uprops.setProperty("TESTPROP2", "testvalue2")
  console.log(uprops.getKeys())
  console.log(uprops.getProperties())
}

function def_props(k, v) {
  var uprops = PropertiesService.getUserProperties()
  uprops.setProperty(k, v)
  return uprops.getProperties()
}

function test_def_props(k, v) {
  sendMessage(processUpdate("/defprops K, V"), admins)
}
