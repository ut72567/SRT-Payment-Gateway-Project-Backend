const { Ticket } = require('./models')
const moment = require('moment')

let uniqueCodeNumbers = 3

function init(config) {
  uniqueCodeNumbers = config.UNIQUE_CODE_NUMBERS || 3
}

async function getAllPossibleUniqueCodes() {
  const arr = []
  for (let i = 0; i < 10 ** uniqueCodeNumbers; i++) arr.push(i)
  return arr
}

async function getUsedUniqueCodes() {
  const activeTickets = await Ticket.find({ active: true })
  return activeTickets.map(t => t.uniqueCode)
}

async function getAvailableUniqueCodes() {
  const usedCodes = await getUsedUniqueCodes()
  const possibleCodes = await getAllPossibleUniqueCodes()
  const availableCodes = possibleCodes.filter(c => usedCodes.indexOf(c) < 0)
  return availableCodes
}

async function generateUniqueCode() {
  const codes = await getAvailableUniqueCodes()
  const uniqueCode = codes[Math.floor(Math.random() * codes.length)];
  return uniqueCode
}

async function generateNewTicket(amount) {
  const basePrice = amount || 49000
  const uniqueCode = parseInt(await generateUniqueCode())
  const price = basePrice + uniqueCode
  const ticket = new Ticket({
    amount: price,
    uniqueCode,
    paid: false,
    active: true,
    expiredTime: moment().add(1, 'day'),
    createdTime: moment()
  })
  const savedTicket = await ticket.save()
  return savedTicket
}

module.exports = { init, getUsedUniqueCodes, getAvailableUniqueCodes, generateNewTicket }
