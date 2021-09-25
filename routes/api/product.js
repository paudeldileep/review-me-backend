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

//@route GET api/product/all
//@desc Get all available product postings
//@access public

router.get('/all',productController.getAllPosts)

//@route GET api/product/own
//@desc Get all available product postings of current user
//@access private

router.get('/own',verifyUser,productController.getOwnPosts)

//@route GET api/product/all/userId
//@desc Get all available product postings of specific user by id
//@access private

router.get('/all/:userId',verifyUser,productController.getPostsByUserId);

//@route GET api/product/productId
//@desc Get details of a single product
//@access private

router.get('/:productId',verifyUser,productController.getSinglePost)



//@route DELETE api/product/productId
//@desc delete a single product
//@access private

router.delete('/:productId',verifyUser,productController.deleteSinglePost)

//@route PUT api/product/productId
//@desc update a single product
//@access private

router.put('/:productId',verifyUser,validation.productUpdate_validation,upload.single('productImage'),productController.updateSinglePost)

//@route POST api/product/productId/review
//@desc post a review
//@access private

router.post('/:productId/review',verifyUser,productController.postReview)

//@route GET api/product/productId/reviews
//@desc get all reviews of a product
//@access private

router.get('/:productId/reviews',verifyUser,productController.getReviews)


//@route POST api/product/like/productId
//@desc post a like/dislike
//@access private

router.post('/:productId/like',verifyUser,productController.postLike)

//@route POST api/product/heart/productId
//@desc post a love/dis-love
//@access private

router.post('/:productId/heart',verifyUser,productController.postHeart)


module.exports=router