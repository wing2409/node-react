const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err, false)
    else return cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function (cb) {
  var user = this
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    cb(null, user)
  })
}

userSchema.methods.findByToken = function (token, cb) {
  var user = this

  jwt.verify(token, 'secretToken', function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
