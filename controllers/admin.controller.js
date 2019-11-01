const { Admin } = require('../models')
const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
  const body = req.body

  if (!body.unique_key && !body.email) {
    return ReE(res, 'Please enter an email to register.')
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.')
  } else {
    let err, admin

    ;[err, admin] = await to(authService.createAdmin(body))

    if (err) return ReE(res, err, 422)
    return ReS(
      res,
      {
        message: 'Successfully created new admin.',
        admin: admin.toWeb(),
        token: admin.getJWT()
      },
      201
    )
  }
}
module.exports.create = create

const get = async function (req, res) {
  let admin = req.admin

  return ReS(res, { admin: admin.toWeb() })
}
module.exports.get = get

const update = async function (req, res) {
  let err, admin, data
  admin = req.admin
  data = req.body
  admin.set(data)

  ;[err, admin] = await to(admin.save())
  if (err) {
    if (err.message == 'Validation error') { err = 'The email address is already in use' }
    return ReE(res, err)
  }
  return ReS(res, { message: 'Updated Admin: ' + admin.email })
}
module.exports.update = update

const remove = async function (req, res) {
  let admin, err
  admin = req.admin

  ;[err, admin] = await to(admin.destroy())
  if (err) return ReE(res, 'error occured trying to delete admin')

  return ReS(res, { message: 'Deleted Admin' }, 204)
}
module.exports.remove = remove

const login = async function (req, res) {
  const body = req.body
  let err, admin

  ;[err, admin] = await to(authService.authAdmin(req.body))
  if (err) return ReE(res, err, 401)
    // console.log(admin.toString())
  return ReS(res, { token: admin.getJWT(), admin: admin.toWeb() })
}
module.exports.login = login
