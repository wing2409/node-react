const express = require('express')
//const mongoose = require('mongoose')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./server/models/User')
const { auth } = require('./server/middleware/auth')

const config = require('./server/config/key')

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

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일 데이터베이스에서 조회
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginStatus: false,
        message: '이메일 및 패스워드를 확인하세요.',
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginStatus: false,
          message: '이메일 및 패스워드를 확인하세요.',
        })
      }

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginStatus: true, userToken: user.token })
      })
    })
  })
  //비밀번호 확인
  //토큰 생성
})

app.get('/api/users/auth', auth, (req, res) => {
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false })
    return res.status(200).send({
      success: true,
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
