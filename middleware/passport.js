const { ExtractJwt, Strategy } = require('passport-jwt')
const { Admin, User } = require('../models')
const CONFIG = require('../config/config')
const { to } = require('../services/util.service')

module.exports = function (passport) {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = CONFIG.jwt_encryption

  passport.use(
    'jwt',
    new Strategy(opts, async function (jwt_payload, done) {
      let err, user
      ;[err, user] = await to(Admin.findById(jwt_payload.admin_id))

      if (err) return done(err, false)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  )

  passport.use(
    'user-jwt',
    new Strategy(opts, async function (jwt_payload, done) {
        console.log(jwt_payload)
      let err, user
      ;[err, user] = await to(User.findById(jwt_payload.user_id))
      console.log('error',err)
      console.log('user',user)

      if (err) return done(err, false)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  )

  passport.use(
    'merchant-jwt',
    new Strategy(opts, async function (jwt_payload, done) {
        console.log(jwt_payload)
      let err, merchant
      ;[err, merchant] = await to(Merchant.findById(jwt_payload.merchant_id))
      console.log('error',err)
      console.log('merchant',merchant)

      if (err) return done(err, false)
      if (merchant) {
        return done(null, merchant)
      } else {
        return done(null, false)
      }
    })
  )
}
