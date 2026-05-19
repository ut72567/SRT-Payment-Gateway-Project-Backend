const mongoose = require('mongoose')

module.exports = {
  Ticket: mongoose.model('Ticket', {
    amount: {},
    uniqueCode: {},
    paid: {},
    active: {},
    createdTime: {},
    expiredTime: {},
    paymentTime: {},
  }),
  History: mongoose.model('History', {
    transactionId: {}, // transaction id
    amount: {}, // transaction amount
    note: {}, // transcaction note
    debitCredit: {}, // 'DEBIT' or 'CREDIT'
    createdAt: {}, // 'ISO date string'
    partnerName: {}, // recipient or sender name
    partnerAccount: {}, // recipient or sender account
    partnerOrg: {}, // recipient or sender organization
    recognized: {},
    bank: {},
  }),
  Config: mongoose.model('Config', {
    key: {},
    value: {}
  })
}
