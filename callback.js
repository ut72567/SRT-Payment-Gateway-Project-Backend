const axios = require('axios')

let enabled, callbackUrl, key

function init(config) {
  enabled = config.callback.enabled
  callbackUrl = config.callback.url
  key = config.callback.key
}

async function call(id) {
  if (enabled) {
    console.log('[+] callback called for id: ' + id)
    return axios.get(callbackUrl, {
      params: {
        id,
        key
      }
    })  
  }
}

module.exports = { init, call }
