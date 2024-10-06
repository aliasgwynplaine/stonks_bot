function processExpenditure(prompt, mssg_id, user_id) {
  var n = prompt.split(',').filter(s => s.length > 0)
  console.log(n)
  var num = parseFloat(n[0])
  var obs = n[1]
  var tag = n[2]

  console.log(num)
  console.log(obs)
  console.log(tag)

  if (num > 0) {
    insert_income(num, obs, tag, mssg_id, user_id)
    return "Ingreso registrado"
  }

  if (num < 0) {
    insert_outcome(num, obs, tag, mssg_id, user_id)
    return "Gasto registrado"
  }

  return "huh?"
}


function insert_income(raw, obs, tag, mssg_id, user_id) {
  var curr_sheet = getCurrSheet()
  var income_cell = curr_sheet.getRange(curr_sheet.getRange(income_ptr).getValue())
  income_cell = insert_entry(raw, obs, tag, mssg_id, user_id, income_cell)
  update_income_ptr(income_cell.getA1Notation(), curr_sheet)
}


function insert_outcome(raw, obs, tag, mssg_id, user_id) {
  var curr_sheet = getCurrSheet()
  var outcome_cell = curr_sheet.getRange(curr_sheet.getRange(outcome_ptr).getValue())
  outcome_cell = insert_entry(raw, obs, tag, mssg_id, user_id, outcome_cell)
  update_outcome_ptr(outcome_cell.getA1Notation(), curr_sheet)
}


function insert_entry(num, obs, tag, mssg_id, user_id, cell) {
  /**
   * @param {string} raw
   * @param {Range} cell
   */
  cell.setValue(num)
  cell.offset(0, 1).setValue(obs)
  cell.offset(0, 2).setValue(new Date()) // Date according to the GAS project!
  cell.offset(0, 3).setValue(tag)
  cell.offset(0, 4).setValue(mssg_id)
  cell.offset(0, 5).setValue(user_id)

  return cell.offset(1,0)
}


function update_income_ptr(v, sheet) {
  sheet.getRange(income_ptr).setValue(v)
}


function update_outcome_ptr(v, sheet) {
  sheet.getRange(outcome_ptr).setValue(v)
}


function getOutcomeCell() {
  var s = getCurrSheet()
  var outcome_cell = s.getRange(outcome_ptr)
  delete s

  return outcome_cell
}


function get_sum_of_the_day() {
  var date = new Date()
  var curr_s = getCurrSheet()
  //var outcomes = curr_s.getRange("E3:"+ getOutcomeCell().getValue()).getValues()
  var outcomes = curr_s.getRange(
    "J3:"+ curr_s.getRange(getOutcomeCell().getValue()).offset(0,3).getA1Notation()
  ).getValues()
  outcomes.pop()
  var dayoutcome = outcomes.filter((outcome) => outcome[2].getDate() == date.getDate())
  var summm = 0

  for (let i = 0; i < dayoutcome.length; i++) {
    summm += dayoutcome[i][0]

  }

  return summm.toFixed(2)
}


function test_processExpediture() {
  sendMessage(processExpenditure("-1, test, test", 0, 0), admins)
}
