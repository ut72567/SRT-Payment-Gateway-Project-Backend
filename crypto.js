const CryptoJS = require("crypto-js")
const randomstring = require('randomstring')
const { Config } = require('./models')

const hardKey = 'rDMjDqCGqJzVfoKJ'

async function encrypt(message, keyEnv, keyCode, keyRemote) {
  const encFn = CryptoJS.AES.encrypt
  let cipher = message
  cipher = encFn(cipher, keyEnv).toString()
  cipher = encFn(cipher, keyCode).toString()
  cipher = encFn(cipher, keyRemote).toString()
  return cipher
}

async function decrypt(message, keyEnv, keyCode, keyRemote) {
  const decFn = CryptoJS.AES.decrypt
  let plain = message
  plain = decFn(plain, keyRemote).toString(CryptoJS.enc.Utf8)
  plain = decFn(plain, keyCode).toString(CryptoJS.enc.Utf8)
  plain = decFn(plain, keyEnv).toString(CryptoJS.enc.Utf8)
  return plain
}

async function getRemoteKey() {
  const remoteKey = await Config.findOne({ key: 'REMOTE_KEY' })
  if (remoteKey != null) {
    return remoteKey.value
  } else {
    const c = new Config({
      key: 'REMOTE_KEY',
      value: randomstring.generate()
    })
    const d = await c.save()
    return d.value
  }
}

async function encryptSecure(message) {
  const keyEnv = process.env.ENC_KEY
  const keyRemote = await getRemoteKey()
  return encrypt(message, keyEnv, hardKey, keyRemote)
}

async function decryptSecure(message) {
  const keyEnv = process.env.ENC_KEY
  const keyRemote = await getRemoteKey()
  return decrypt(message, keyEnv, hardKey, keyRemote)
}

module.exports = { encryptSecure, decryptSecure }