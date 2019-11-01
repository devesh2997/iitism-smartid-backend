const { UserDump } = require('../models')
const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
  const body = req.body
  let err, userdump
  ;[err, userdump] = await to(UserDump.create(body))
  if (err) return ReE(res, err, 422)

  let userdump_json = userdump.toWeb()

  return ReS(res, { userdump: userdump_json }, 201)
}
module.exports.create = create

const bulkCreate = async function (req, res) {
  const body = req.body
  console.log('req', req)
  console.log('body', body)
  const receivedDataCount = body.count
  let receivedData = body.data
  console.log(receivedData)
  receivedData = JSON.parse(JSON.stringify(receivedData))
  let createdRecordsCount = 0
  let errorCount = 0
  let error
  for (let i = 0; i < receivedDataCount; i++) {
    const data = receivedData[i]
    console.log('data', data)
    let err, userdump
    ;[err, userdump] = await to(UserDump.create(data))
    if (!err) {
      createdRecordsCount++
    } else {
      error = err
      errorCount++
    }
  }

  //   if (errorCount > 0) return ReE(res, error, 422)

  return ReS(
    res,
    { createdRecordsCount: createdRecordsCount, errorCount: errorCount, error },
    201
  )
}
module.exports.bulkCreate = bulkCreate

const getByAdmissionNumber = async function (req, res) {
  let userdump = req.userdump

  return ReS(res, { userdump: userdump.toWeb() })
}

module.exports.getByAdmissionNumber = getByAdmissionNumber

const query = async function (req, res) {
  let userdumps = req.userdumps

  return ReS(res, { userdumps: userdumps})
}
module.exports.query = query


const get = async function (req, res) {
  let userdump = req.userdump

  return ReS(res, { userdump: userdump.toWeb() })
}
module.exports.get = get

const getAll = async function (req, res) {
  ;[err, userdumps] = await to(UserDump.findAll())

  let userdumps_json = []

  for (let i in userdumps) {
    let userdump = userdumps[i]
    // console.log(i, userdump)
    userdumps_json.push(userdump.toWeb())
  }

  console.log('userdumps_json', userdumps_json)
  return ReS(res, { userdumps: userdumps_json })
}

module.exports.getAll = getAll

const update = async function (req, res) {
  let err, userdump, data
  userdump = req.userdump
  data = req.body
  userdump.set(data)
  ;[err, userdump] = await to(userdump.save())
  if (err) {
    if (err.message == 'Validation error') {
      err = 'Error occurred'
    }
    return ReE(res, err)
  }
  return ReS(res, { message: 'Updated User: ' + userdump.email })
}
module.exports.update = update

const remove = async function (req, res) {
  let userdump, err
  userdump = req.userdump
  ;[err, userdump] = await to(userdump.destroy())
  if (err) return ReE(res, 'error occured trying to delete userdump')

  return ReS(res, { message: 'Deleted User' }, 204)
}
module.exports.remove = remove
