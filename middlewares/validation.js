const {check} = require('express-validator')

exports.userLogin_validation=[
    check('email','Valid email is required').isEmail(),
    check('password','Valid password is required').exists()
]

exports.userRegister_validation = [
    check("firstname", "First Name is required").not().isEmpty(),
    check("lastname", "Last Name is required").not().isEmpty(),
    check("email", "Valid email is required").not().isEmpty().isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ]
 
  exports.newProduct_validation=[
    check("title","Product title is required").not().isEmpty().isString(),
    check("description","Product Description is required").not().isEmpty().isString(),
    check("productImage","Product Image is required").not().isEmpty()
  ]

  exports.productUpdate_validation=[
    check("title","Product title is required").not().isEmpty().isString(),
    check("description","Product Description is required").not().isEmpty().isString(),
   
  ]

  exports.adminRegister_validation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").not().isEmpty().isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ]
