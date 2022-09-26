const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

mongoose.connect(
  'mongodb+srv://test:1234@cluster0.gax5u.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  },
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
