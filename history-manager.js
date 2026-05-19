const _ = require('underscore')
const { History } = require('./models')

// define available banks here
const availableBanks = [{
  name: 'jenius',
  module: require('./bank/jenius')
}]

// static variables
let banks = []
let credentials = {}

function init(config) {
  banks = config.banks || ['jenius']
  credentials = config.credentials || {}
}

async function refresh() {
  const oldHistory = await History.find()
  let newHistory = []

  for (let bank of availableBanks) {
    if (_.contains(banks, bank.name)) {
      const h = await bank.module.getHistory(credentials[bank.name])
      newHistory = newHistory.concat(h)
    }
  }

  const oldHistoryIds = oldHistory.map(r => r.transactionId)

  await Promise.all(newHistory.reduce((result, r) => {
    if (!_.contains(oldHistoryIds, r.id)) {
      console.log('[+] saving new history: ' + r.id)
      const h = new History(r)
      result.push(h.save())
    }
    return result
  }, []))

  await markIrrelevantAsRecognized()
}

async function getUnrecognized() {
  return History.find({ recognized: { $ne: true } })
}

async function markIrrelevantAsRecognized() {
  const data = await History.find({ recognized: { $ne: true } })
  return Promise.all(data.reduce((result, record) => {
    if (record.debitCredit == 'DEBIT'
      || record.partnerName == 'Interest'
      || record.partnerName == 'Tax on Interest'
    ) {
      console.log('[+] marked recognized irrelevant history: ' + record.id)
      record.recognized = true
      result.push(record.save())
    }
    return result
  }, []))
}

async function markRecognized(id) {
  console.log('[+] marked recognized history: ' + id)
  const h = await History.findOne(id)
  h.recognized = true
  console.log(h)
  return h.save()
}

module.exports = { init, refresh, getUnrecognized, markRecognized }
