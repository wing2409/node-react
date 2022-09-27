const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('mongoose success')
  })
  .catch(() => {
    console.log('mongoose fail')
  })

app.get('/', (req, res) => {
  res.send('Hello World!!')
})

app.post('/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
