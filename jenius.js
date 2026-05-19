const JeniusBankScraper = require('id-bank-scraper/jenius')
const crypto = require('../crypto')

async function getHistory(credential) {
  let cred = { ...credential }
  if (cred.encrypted) cred.password = await crypto.decryptSecure(cred.password)

  const jeniusHistory = await JeniusBankScraper.getHistory(cred)
  const jeniusHistory2 = jeniusHistory.map(r => ({ ...r, transactionId: r.id, bank: 'jenius', recognized: false }))
  return jeniusHistory2
}

module.exports = { getHistory }
