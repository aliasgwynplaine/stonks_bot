var stonks_in_h = [
  "fecha", "monto", 
  /* modifica a partir de aquí */
  "observ", "tag"
]

var stonks_out_h = [
  "fecha", "monto", 
  /* modifica a partir de aquí */
  "producto", "tipo", "lugar", "método"
]

stonks_in_h = stonks_in_h.concat(["msg_id", "user_id"])
stonks_out_h = stonks_out_h.concat(["msg_id", "user_id"])


function create_new_stonks_sheet(title, spreadsheet) {
  /**
   * @param {string} title 
   * @param {Spreadsheet} spreadsheet
   * @returns {Sheet} sheet
   */
  var sheet = create_new_sheet(title, spreadsheet)
  var stonks_headers = stonks_in_h.concat(stonks_out_h)
  var stonks_titles  = ["Ingresos"]
  
  for (let i = 0; i < stonks_in_h.length - 1; i++) stonks_titles.push("")

  stonks_titles.push("Egresos")
  sheet.appendRow(["income_ptr"])
  sheet.appendRow(["outcome_ptr"])
  sheet.appendRow(stonks_titles)
  sheet.appendRow(stonks_headers)
  var frst_entry = sheet.getRange("A5")
  update_income_ptr(frst_entry.getA1Notation(), sheet)
  update_outcome_ptr(frst_entry.offset(0,stonks_in_h.length).getA1Notation(), sheet)
  var range = sheet.getRange("3:4")
  range.setFontWeight("bold")
  sheet.hideRows(1,2)

  return sheet
}


function processExpenditure(prompt, mssg_id, user_id) {
  var n = prompt.split(',').filter(s => s.length > 0)
  n[0] = parseFloat(n[0])
  n.push(mssg_id)
  n.push(user_id)

  //sendMessage(n.toString(), admins)
  if (n[0] > 0 && n.length <= stonks_in_h.length) {
    insert_income(n)
    return "Ingreso registrado "
  }

  if (n[0] < 0 && n.length <= stonks_out_h.length) {
    insert_outcome(n)
    return "Gasto registrado"
  }

  return "huh?"
}


function insert_income(n) {
  var curr_sheet = getCurrStonksSheet()
  var income_cell = curr_sheet.getRange(curr_sheet.getRange(income_ptr).getValue())
  income_cell = insert_entry(n, income_cell)
  update_income_ptr(income_cell.getA1Notation(), curr_sheet)
}


function insert_outcome(n) {
  var curr_sheet = getCurrStonksSheet()
  var outcome_cell = curr_sheet.getRange(curr_sheet.getRange(outcome_ptr).getValue())
  outcome_cell = insert_entry(n, outcome_cell)
  update_outcome_ptr(outcome_cell.getA1Notation(), curr_sheet)
}


function insert_entry(n, cell) {
  cell.setValue(new Date())

  for (let i = 0; i < n.length; i++) {
    cell.offset(0, i + 1).setValue(n[i])
  }

  return cell.offset(1,0)
}


function insert_tot(sum) {
  var curr_sheet = getCurrStonksSheet()
  var cell = curr_sheet.getRange(curr_sheet.getRange(outcome_ptr).getValue())

  cell.setValue(new Date())

  for (let i = 0; i < 7; i++) {
    if (i<5){
        cell.offset(0, i + 1).setBackground("#808080")}
    if (i==5){
        cell.offset(0, i + 1).setValue('TOTAL : ')}
    if (i==6){
        cell.offset(0, i + 1).setValue(sum)}
  }
  
  outcome_cell = cell.offset(1,0)
  update_outcome_ptr(outcome_cell.getA1Notation(), curr_sheet)

}

function test_sum() {
  insert_tot("20")
}


function update_income_ptr(v, sheet) {
  sheet.getRange(income_ptr).setValue(v)
}


function update_outcome_ptr(v, sheet) {
  sheet.getRange(outcome_ptr).setValue(v)
}


function getOutcomeCell() {
  var s = getCurrStonksSheet()
  var outcome_cell = s.getRange(outcome_ptr)
  delete s

  return outcome_cell
}


function get_sum_of_the_day() {
  var date = new Date()
  var curr_s = getCurrStonksSheet()
  var frst_entry = curr_s.getRange("A5").offset(0,stonks_in_h.length).getA1Notation()
  //var outcomes = curr_s.getRange("E3:"+ getOutcomeCell().getValue()).getValues()
  var outcomes = curr_s.getRange(
    frst_entry +":"+ curr_s.getRange(getOutcomeCell().getValue()).offset(0,stonks_in_h.length).getA1Notation()
  ).getValues()
  outcomes.pop()
  var dayoutcome = outcomes.filter((outcome) => outcome[0].getDate() == date.getDate())
  var summm = 0

  for (let i = 0; i < dayoutcome.length; i++) {
    summm += dayoutcome[i][1]
  }
  insert_tot(summm)

  return summm.toFixed(2)
}


function test_processExpediture() {
  processExpenditure("-1, test, test", 21, 0)
  processExpenditure("1, test, test", 21, 0)
}


