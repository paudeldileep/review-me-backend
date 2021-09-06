const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const productController=require('../../controllers/productController')
const verifyUser = require('../../middlewares/verifyUser')
const upload= require('../../middlewares/multer')

//const productController=
//const validation=

//@route POST api/product/new
//@desc register a new user product for review
//@access private
router.post('/new',verifyUser,validation.newProduct_validation,upload.single('productImage'),productController.addNewProduct);







module.exports=router