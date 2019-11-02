const { Merchant, User }          = require('../models');
const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){
    const body = req.body;
    if(!body.unique_key && !body.email && !body.mobile_no){
        return ReE(res, 'Please enter an email or phone number to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, merchant;

        [err, merchant] = await to(authService.createMerchant(body));

        if(err) return ReE(res, err, 422);
        return ReS(res, {message:'Successfully created new merchant.', merchant:merchant.toWeb(), token:merchant.getJWT()}, 201);
    }
}
module.exports.create = create;

const getTransactions = async function (req, res) {
    let merchant = req.merchant
  
    ;[err, transactions] = await to(merchant.getTransactions({order:[['created_at','DESC']]}))
  
    if (err) return ReE(res, err, 422)
  
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i]
      transaction = transaction.toWeb()
      let err, user, admin
      ;[err, user] = await to(User.findById(transaction.user_id))
      if (err) return ReE(res, err, 422)
      let user_json = {}
      user_json.first_name = user.first_name
      user_json.middle_name = user.middle_name
      user_json.last_name = user.last_name
      transaction.user = user_json
      transactions[i] = transaction
    }
  
    return ReS(res, { transactions: transactions })
  }
  
  module.exports.getTransactions = getTransactions

const get = async function(req, res){
    let merchant = req.merchant;

    return ReS(res, {merchant:merchant.toWeb()});
}
module.exports.get = get;

const getAll = async function (req, res) {
    ;[err, merchants] = await to(Merchant.findAll())
  
    let merchants_json = []
  
    for (let i in merchants) {
      let merchant = merchants[i]
      // console.log(i, userdump)
      merchants_json.push(merchant.toWeb())
    }
    return ReS(res, { merchants: merchants_json })
  }
  
  module.exports.getAll = getAll

const update = async function(req, res){
    let err, merchant, data
    merchant = req.merchant;
    data = req.body;
    merchant.set(data);

    [err, merchant] = await to(merchant.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated Merchant: '+merchant.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let merchant, err;
    merchant = req.merchant;

    [err, merchant] = await to(merchant.destroy());
    if(err) return ReE(res, 'error occured trying to delete merchant');

    return ReS(res, {message:'Deleted Merchant'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, merchant;

    [err, merchant] = await to(authService.authMerchant(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:merchant.getJWT(), merchant:merchant.toWeb()});
}
module.exports.login = login;