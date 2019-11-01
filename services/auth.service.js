const { User, Merchant, Admin } = require('../models')
const validator = require('validator')
const { to, TE } = require('../services/util.service')

const getUniqueKeyFromBody = function (body) {
  // this is so they can send in 3 options unique_key, email, or phone and it will work
  let unique_key = body.unique_key
  if (typeof unique_key === 'undefined') {
    if (typeof body.email !== 'undefined') {
      unique_key = body.email
    } else {
      unique_key = null
    }
  }

  return unique_key
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody

const createUser = async userInfo => {
  let unique_key, auth_info, err

  auth_info = {}
  auth_info.status = 'create'
  if (typeof userInfo.smartid_no === 'undefined') { TE('SmartCard id cannot be null.') }
  if (typeof userInfo.admn_no === 'undefined') { TE('Admission number was not entered.') }
  unique_key = getUniqueKeyFromBody(userInfo)
  if (!unique_key) TE('An email or phone number was not entered.')
  userInfo.balance = 0.0
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email'
    userInfo.email = unique_key
    ;[err, user] = await to(User.create(userInfo))
    console.log(err)
    if (err) TE('user already exists with that email or admission number')

    return user
  } else if (validator.isMobilePhone(unique_key, 'any')) {
    // checks if only phone number was sent
    auth_info.method = 'phone'
    userInfo.phone = unique_key
    ;[err, user] = await to(User.create(userInfo))
    if (err) TE('user already exists with that phone number')

    return user
  } else {
    TE('A valid email or phone number was not entered.')
  }
}
module.exports.createUser = createUser

const createMerchant = async merchantInfo => {
  let unique_key, auth_info, err

  auth_info = {}
  auth_info.status = 'create'
  unique_key = getUniqueKeyFromBody(merchantInfo)
  if (!unique_key) TE('An email was not entered.')
  merchantInfo.balance = 0.0
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email'
    merchantInfo.email = unique_key
    ;[err, merchant] = await to(Merchant.create(merchantInfo))
    console.log(err)
    if (err) TE('merchant already exists with that email')

    return merchant
  } else {
    TE('A valid email was not entered.')
  }
}
module.exports.createMerchant = createMerchant

const createAdmin = async userInfo => {
  let unique_key, auth_info, err

  auth_info = {}
  auth_info.status = 'create'

  unique_key = getUniqueKeyFromBody(userInfo)
  if (!unique_key) TE('An email or phone number was not entered.')

  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email'
    userInfo.email = unique_key
    ;[err, user] = await to(Admin.create(userInfo))
    if (err) TE('user already exists with that email')

    return user
  } else if (validator.isMobilePhone(unique_key, 'any')) {
    // checks if only phone number was sent
    auth_info.method = 'phone'
    userInfo.phone = unique_key
    ;[err, user] = await to(Admin.create(userInfo))
    if (err) TE('user already exists with that phone number')

    return user
  } else {
    TE('A valid email or phone number was not entered.')
  }
}
module.exports.createAdmin = createAdmin

const authUser = async function (userInfo) {
  // returns token
  let unique_key = userInfo.admn_no
  let auth_info = {}
  auth_info.status = 'login'

  if (!unique_key) TE('Please enter an admission number to login')

  if (!userInfo.password) TE('Please enter a password to login')

  let user
  ;[err, user] = await to(User.findOne({ where: { admn_no: unique_key } }))
  if (err) TE(err.message)

  if (!user) TE('Not registered')
  ;[err, user] = await to(user.comparePassword(userInfo.password))

  if (err) TE(err.message)

  return user
}
module.exports.authUser = authUser

const authMerchant = async function (merchantInfo) {
  // returns token
  let unique_key = merchantInfo.email
  let auth_info = {}
  auth_info.status = 'login'

  if (!unique_key) TE('Please enter an email to login')

  if (!merchantInfo.password) TE('Please enter a password to login')

  let merchant
  ;[err, merchant] = await to(Merchant.findOne({ where: { email: unique_key } }))
  if (err) TE(err.message)

  if (!merchant) TE('Not registered')
  ;[err, merchant] = await to(merchant.comparePassword(merchantInfo.password))

  if (err) TE(err.message)

  return merchant
}
module.exports.authMerchant = authMerchant

// const authUser = async function (userInfo) {
//   // returns token
//   let unique_key
//   let auth_info = {}
//   auth_info.status = 'login'
//   unique_key = getUniqueKeyFromBody(userInfo)

//   if (!unique_key) TE('Please enter an email or phone number to login')

//   if (!userInfo.password) TE('Please enter a password to login')

//   let user
//   if (validator.isEmail(unique_key)) {
//     auth_info.method = 'email'
//     ;[err, user] = await to(User.findOne({ where: { email: unique_key } }))
//     if (err) TE(err.message)
//   } else if (validator.isMobilePhone(unique_key, 'any')) {
//     // checks if only phone number was sent
//     auth_info.method = 'phone'
//     ;[err, user] = await to(User.findOne({ where: { phone: unique_key } }))
//     if (err) TE(err.message)
//   } else {
//     TE('A valid email or phone number was not entered')
//   }

//   if (!user) TE('Not registered')
//   ;[err, user] = await to(user.comparePassword(userInfo.password))

//   if (err) TE(err.message)

//   return user
// }
// module.exports.authUser = authUser

const authAdmin = async function (adminInfo) {
  // returns token
  let unique_key
  let auth_info = {}
  auth_info.status = 'login'
  unique_key = getUniqueKeyFromBody(adminInfo)

  if (!unique_key) TE('Please enter an email to login')

  if (!adminInfo.password) TE('Please enter a password to login')

  let admin
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email'
    ;[err, admin] = await to(Admin.findOne({ where: { email: unique_key } }))
    if (err) TE(err.message)
  } else {
    TE('A valid email was not entered')
  }

  if (!admin) TE('Not registered')
  ;[err, admin] = await to(admin.comparePassword(adminInfo.password))

  if (err) TE(err.message)

  return admin
}
module.exports.authAdmin = authAdmin
