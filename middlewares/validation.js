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