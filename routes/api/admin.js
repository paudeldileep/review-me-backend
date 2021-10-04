const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const adminController=require('../../controllers/adminController');
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





module.exports=router