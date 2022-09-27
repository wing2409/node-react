const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10
const someOtherPlaintextPassword = 'not_bacon'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    maxlength: 120,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

userSchema.pre('save', function (next) {
  var user = this
  console.log('111')
  if (user.isModified('password')) {
    console.log('222')
    bcrypt.genSalt(saltRounds, function (err, salt) {
      console.log('333')
      bcrypt.hash(user.password, salt, function (err, hash) {
        console.log('444')
        user.password = hash
        next()
      })
    })
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
