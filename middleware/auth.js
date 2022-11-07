const { User } = require('../models/User')

let auth = (req, res, next) => {
  //인증처리
  //클라이언트 쿠키에서 토큰 가져간다.
  let token = req.cookie.x_auth
  //토큰 복호화 후 유저 조회
  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user) return res.json({ isAuth: false, error: true })

    req.token = token
    req.user = user
    next()
  })

  //유저 존재 시 OK
  //유저 없으면 fail
}

module.exports = { auth }
