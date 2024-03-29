const { User, Merchant } = require('../models')
const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
  const body = req.body
  if (!body.unique_key && !body.email && !body.mobile_no && !body.admn_no) {
    return ReE(res, 'Please enter an email or phone number to register.')
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.')
  } else {
    let err, user
    ;[err, user] = await to(authService.createUser(body))

    if (err) return ReE(res, err, 422)
    return ReS(
      res,
      {
        message: 'Successfully created new user.',
        user: user.toWeb(),
        token: user.getJWT()
      },
      201
    )
  }
}
module.exports.create = create

const getTransactions = async function (req, res) {
  let user = req.user

  ;[err, transactions] = await to(
    user.getTransactions({ order: [['created_at', 'DESC']] })
  )

  if (err) return ReE(res, err, 422)

  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i]
    transaction = transaction.toWeb()
    let err, user, admin
    if (
      transaction.merchant_id !== undefined &&
      transaction.merchant_id !== null
    ) {
      ;[err, merchant] = await to(Merchant.findById(transaction.merchant_id))
      if (err) return ReE(res, err, 422)
      let merchant_json = {}
      merchant_json.business_name = merchant.business_name
      merchant_json.first_name = merchant.first_name
      merchant_json.middle_name = merchant.middle_name
      merchant_json.last_name = merchant.last_name
      transaction.merchant = merchant_json
      transactions[i] = transaction
    }
  }

  return ReS(res, { transactions: transactions })
}

module.exports.getTransactions = getTransactions

const get = async function (req, res) {
  let user = req.user

  return ReS(res, { user: user.toWeb() })
}
module.exports.get = get

const update = async function (req, res) {
  let err, user, data
  user = req.user
  data = req.body
  user.set(data)
  ;[err, user] = await to(user.save())
  if (err) {
    if (err.message == 'Validation error') {
      err = 'The email address or phone number is already in use'
    }
    return ReE(res, err)
  }
  return ReS(res, { message: 'Updated User: ' + user.email })
}
module.exports.update = update

const remove = async function (req, res) {
  let user, err
  user = req.user
  ;[err, user] = await to(user.destroy())
  if (err) return ReE(res, 'error occured trying to delete user')

  return ReS(res, { message: 'Deleted User' }, 204)
}
module.exports.remove = remove

const login = async function (req, res) {
  const body = req.body
  let err, user
  ;[err, user] = await to(authService.authUser(req.body))
  if (err) return ReE(res, err, 422)

  return ReS(res, { token: user.getJWT(), user: user.toWeb() })
}
module.exports.login = login
