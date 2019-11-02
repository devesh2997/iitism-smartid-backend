const express 			= require('express');
const router 			= express.Router();

const TransactionController = require('../controllers/transaction.controller')
const UserController 	= require('../controllers/user.controller');
const MerchantController = require('../controllers/merchant.controller')
const UserDumpController = require('../controllers/userdump.controller')
const AdminController = require('../controllers/admin.controller')
const CompanyController = require('../controllers/company.controller');
const HomeController 	= require('../controllers/home.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending APIS", data:{"version_number":"v1.0.0"}})
});

router.post(    '/transactions/credit',    passport.authenticate('jwt', {session:false}), TransactionController.credit);  


router.post(    '/users',           passport.authenticate('jwt', {session:false}), UserController.create);                                                    // C
router.get(     '/users',           passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.get(     '/admin/user/:admn_no',  passport.authenticate('jwt', {session:false}), custom.user, UserController.get);        // R
router.get(     '/user/:admn_no',  passport.authenticate('user-jwt', {session:false}), custom.user, UserController.get);        // R
router.get(     '/user/transactions/:admn_no',  passport.authenticate('user-jwt', {session:false}), custom.user, UserController.getTransactions);        // R
router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post(    '/users/login',     UserController.login);

router.post(    '/merchants',           passport.authenticate('jwt', {session:false}), MerchantController.create);                                                    // C
router.get(     '/merchants',           passport.authenticate('jwt', {session:false}), MerchantController.getAll);        // R
router.get(     '/admin/merchant/:admn_no',  passport.authenticate('jwt', {session:false}), custom.merchant, MerchantController.get);        // R
router.get(     '/merchant/:merchant_id',  passport.authenticate('merchant-jwt', {session:false}), custom.merchant, MerchantController.get);
router.get(     '/merchant/transactions/:merchant_id',  passport.authenticate('merchant-jwt', {session:false}), custom.merchant, MerchantController.getTransactions);        // R
router.put(     '/merchants',           passport.authenticate('jwt', {session:false}), MerchantController.update);     // U
router.delete(  '/merchants',           passport.authenticate('jwt', {session:false}), MerchantController.remove);     // D
router.post(    '/merchants/login',     MerchantController.login);

router.post(    '/userdump',           passport.authenticate('jwt', {session:false}), UserDumpController.create); 
router.post(    '/userdump/bulk',      passport.authenticate('jwt', {session:false}), UserDumpController.bulkCreate);   
router.get(     '/userdump/query/:query',           passport.authenticate('jwt', {session:false}), custom.queryUserDump, UserDumpController.query);                                                     // C
router.get(     '/userdump',           passport.authenticate('jwt', {session:false}), UserDumpController.get);
router.get(     '/userdump/:admn_no',           passport.authenticate('jwt', {session:false}), custom.userdump, UserDumpController.getByAdmissionNumber);          
router.put(     '/userdump',           passport.authenticate('jwt', {session:false}), UserDumpController.update);     // U
router.delete(  '/userdump',           passport.authenticate('jwt', {session:false}), UserDumpController.remove);     // D
router.get(     '/userdumps',           passport.authenticate('jwt', {session:false}), UserDumpController.getAll);        // R


router.post(    '/admins',           AdminController.create);                                                    // C
router.get(     '/admins',           passport.authenticate('jwt', {session:false}), AdminController.get);        // R
router.put(     '/admins',           passport.authenticate('jwt', {session:false}), AdminController.update);     // U
router.delete(  '/admins',           passport.authenticate('jwt', {session:false}), AdminController.remove);     // D
router.post(    '/admins/login',     AdminController.login);

router.post(    '/companies',             passport.authenticate('jwt', {session:false}), CompanyController.create);                  // C
router.get(     '/companies',             passport.authenticate('jwt', {session:false}), CompanyController.getAll);                  // R

router.get(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.get);     // R
router.put(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.update);  // U
router.delete(  '/companies/:company_id', 
passport.authenticate('jwt', {session:false}), custom.company, CompanyController.remove);  // D

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
