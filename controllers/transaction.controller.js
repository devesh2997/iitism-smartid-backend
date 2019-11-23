const { Transaction, User, sequelize } = require('../models')
const { to, ReE, ReS } = require('../services/util.service')

const credit = async function (req, res) {
  let err, transaction_info, result

  transaction_info = req.body
  transaction_info['type'] = 'credit'

  sequelize
    .transaction(function (t) {
      return User.findById(transaction_info.user_id, { transaction: t }).then(
        function (user) {
          if (user === undefined || user === null) {
            return { error: true }
          }
          user.balance += Number(transaction_info.amount)
          return user.save({ transaction: t }).then(function (user) {
            return Transaction.create(transaction_info, { transaction: t })
          })
        }
      )
    })
    .then(function (result) {
      console.log(result)
      if (result.error === true) { return ReE(res, { error: 'user does not exist' }, 201) }
      return ReS(res, { transaction: result }, 201)
    })
    .catch(function (err) {
      if (err) return ReE(res, err, 422)
    })

  // ;[err, transaction] = await to(Transaction.create(transaction_info))

  // let transaction_json = transaction.toWeb()
}
module.exports.credit = credit
