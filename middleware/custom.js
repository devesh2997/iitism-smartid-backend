const Company = require('./../models').Company
const UserDump = require('./../models').UserDump
const User = require('./../models').User
const Merchant = require('./../models').Merchant
const { to, ReE, ReS } = require('../services/util.service')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

let company = async function (req, res, next) {
  let company_id, err, company
  company_id = req.params.company_id
  ;[err, company] = await to(Company.findOne({ where: { id: company_id } }))
  if (err) return ReE(res, 'err finding company')

  if (!company) return ReE(res, 'Company not found with id: ' + company_id)
  let user, users_array, users
  user = req.user
  ;[err, users] = await to(company.getUsers())

  users_array = users.map(obj => String(obj.user))

  if (!users_array.includes(String(user._id))) {
    return ReE(
      res,
      'User does not have permission to read app with id: ' + app_id
    )
  }

  req.company = company
  next()
}
module.exports.company = company

let userdump = async function (req, res, next) {
  let admn_no, err
  console.log(req.params)
  admn_no = req.params.admn_no
  ;[err, userdump] = await to(UserDump.findOne({ where: { admn_no: admn_no } }))
  if (err) return ReE(res, 'err finding userdump')

  if (!userdump) {
    return ReE(res, 'Userdump not found with admission number: ' + admn_no)
  }

  req.userdump = userdump
  next()
}
module.exports.userdump = userdump

let queryUserDump = async function (req, res, next) {
  let query, err, userdumps
  console.log(req.params)
  query = req.params.query
  query = '%' + query + '%'
  ;[err, userdumps] = await to(
    UserDump.findAll({
      where: {
        [Op.or]: [
          { admn_no: { [Op.like]: query } },
          { first_name: { [Op.like]: query } },
          { middle_name: { [Op.like]: query } },
          { last_name: { [Op.like]: query } }
        ]
      }
    })
  )
  if (err) return ReE(res, 'err finding userdump')

  if (!userdumps) return ReE(res, 'UserDump not found with query: ' + query)

  let userdumps_json = []

  for (let i in userdumps) {
    let userdump = userdumps[i]
    // console.log(i, userdump)
    userdumps_json.push(userdump.toWeb())
  }

  req.userdumps = userdumps_json
  next()
}
module.exports.queryUserDump = queryUserDump

let user = async function (req, res, next) {
  let admn_no, err
  console.log(req.params)
  admn_no = req.params.admn_no
  ;[err, user] = await to(User.findOne({ where: { admn_no: admn_no } }))
  if (err) return ReE(res, 'err finding user')

  if (!user) return ReE(res, 'User not found with admission number: ' + admn_no)

  req.user = user
  next()
}
module.exports.user = user

let merchant = async function (req, res, next) {
  let merchant_id, err
  console.log(req.params)
  merchant_id = req.params.merchant_id
  ;[err, merchant] = await to(Merchant.findOne({ where: { id: merchant_id } }))
  if (err) return ReE(res, 'err finding merchant')

  if (!merchant) return ReE(res, 'Merchant not found with id: ' + merchant_id)

  req.merchant = merchant
  next()
}
module.exports.merchant = merchant
