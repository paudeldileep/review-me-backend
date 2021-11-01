const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const adminController=require('../../controllers/adminController');
const userController=require('../../controllers/userController');
const verifyAdmin = require('../../middlewares/verifyAdmin');


//@route POST api/admin/login
//@desc login a admin
//@access public

router.post('/login',validation.userLogin_validation,adminController.adminLogin)


//@route POST api/admin/register
//@desc register a admin
//@access public

router.post('/register',validation.adminRegister_validation,adminController.adminRegister)



//@route GET api/admin
//@desc GET a admin info
//@access private

router.get('/',verifyAdmin,adminController.adminInfo)



//get total counts of users and products

//@route GET api/admin/count
//@desc GET  total counts of users and products
//@access private
router.get('/count',verifyAdmin,adminController.totalCounts)

//get top products with max reviews

//@route GET api/admin/top_pr
//@desc GET  top products with max reviews
//@access private
router.get('/top_pr',verifyAdmin,adminController.getTopProducts)


//get users(5) with most products

//@route GET api/admin/top_users
//@desc GET  top users
//@access private
router.get('/top_users',verifyAdmin,adminController.getUsersOverview)

//@route GET api/admin/all_pr
//@desc GET  all products
//@access private
router.get('/all_pr',verifyAdmin,adminController.getAllProducts)

//@route GET api/admin/approved_pr
//@desc GET  approved products
//@access private
router.get('/approved_pr',verifyAdmin,adminController.getApprovedProducts)

//@route GET api/admin/pending_pr
//@desc GET  products posting waiting for approval
//@access private
router.get('/pending_pr',verifyAdmin,adminController.getPendingProducts)


//@route GET api/admin/product/:productId
//@desc GET  details of a product 
//@access private
router.get('/product/:productId',verifyAdmin,adminController.getProductById)

//@route PUT api/admin/product/:productId
//@desc UPDATE  approval status
//@access private
router.put('/product/:productId',verifyAdmin,adminController.approveProductById)

//@route POST api/admin/product/featured/:productId
//@desc UPDATE featured status
//@access private
router.post('/product/featured/:productId',verifyAdmin,adminController.setFeatured)

//@route DELETE api/admin/product/:productId
//@desc Dlete a product 
//@access private
router.delete('/product/:productId',verifyAdmin,adminController.deleteProductById)


/* **************** USERS ***************** */


//@route GET api/admin/users
//@desc GET all users
//@access private
router.get('/users',verifyAdmin,userController.getAllUsers)



//@route DELETE api/admin/users
//@desc DELETE a user by id
//@access private
router.delete('/user/:userId',verifyAdmin,adminController.deleteUserById)


//@route GET api/admin/user/all_pr/:userId
//@desc GET all products of a user
//@access private
router.get('/user/all_pr/:userId',verifyAdmin,adminController.getAllUserProducts)

module.exports=router