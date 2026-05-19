require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const HistoryManager = require('./history-manager')
const TicketManager = require('./ticket-manager')
const { Ticket } = require('./models')
const CronManager = require('./cron')
const Callback = require('./callback')

const config = {
  uniqueCodeNumbers: process.env.UNIQUE_CODE_NUMBERS || 3,
  banks: ['jenius'],
  credentials: {
    jenius: {
      email: process.env.JENIUS_EMAIL,
      password: process.env.JENIUS_PASSWORD,
      encrypted: process.env.JENIUS_ENCRYPTED == 'true'
    }
  },
  cron: {
    enabled: process.env.ENABLE_SCHEDULER == 'true',
    refreshSchedule: process.env.REFRESH_SCHEDULE
  },
  callback: {
    enabled: process.env.WEBHOOK_ENABLED == 'true',
    url: process.env.WEBHOOK_CALLBACK_URL,
    key: process.env.WEBHOOK_KEY
  }
}

const server = express()
server.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URL)
HistoryManager.init(config)
TicketManager.init(config)
CronManager.init(config)
Callback.init(config)

server.post('/api/ticket/new', async (req, res) => {
  const amount = parseInt(req.body.amount)
  if (amount == null) return res.json({ success: false })
  const ticket = await TicketManager.create(amount)
  res.json(ticket)
})

server.get('/api/ticket/all', async (req, res) => {
  const ticket = await Ticket.find()
  res.json(ticket)
})

server.get('/api/ticket/active', async (req, res) => {
  const ticket = await Ticket.find({ active: true })
  res.json(ticket)
})

server.get('/api/ticket/:ticketId', async (req, res) => {
  const ticket = await TicketManager.get(req.params.ticketId)
  res.json(ticket)
})

server.get('/api/action/refresh', async (req, res) => {
  await HistoryManager.refresh()
  const unrecognizedHistory = await HistoryManager.getUnrecognized()
  await TicketManager.refresh(unrecognizedHistory, HistoryManager.markRecognized)
  res.json({ success: true })
})

server.get('/api/action/mark/paid/:ticketId', async (req, res) => {
  await TicketManager.markPaid(req.params.ticketId)
  res.json({ success: true })
})

module.exports = server
