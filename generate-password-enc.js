require('dotenv').config()
require('mongoose').connect(process.env.MONGO_URL)
const { encryptSecure, decryptSecure } = require('../crypto')

if (process.argv.length < 4) {
  console.log('command: node generate-password-enc.js [enc|dec] <message>')
  process.exit(1)
}
const mode = process.argv[2]
const message = process.argv[3]  

if (mode == 'dec') {
  decryptSecure(message).then(console.log)
} else if (mode == 'enc') {
  encryptSecure(message).then(console.log)
} else {
  console.log('command: node generate-password-enc.js [enc|dec] <message>')    
  process.exit(1)
}
