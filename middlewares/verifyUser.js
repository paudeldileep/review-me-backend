const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = function(req,res,next){
    //Get token from header
    const token = req.header('x-auth-token');

    //console.log(token)
    //Check if not token
    if(!token){
        return res.status(401).json({errors:[{message:'Authorization failed!!'}]});
    }

    //verify token and assign decoded data(here currently email address) to req.user
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user = decoded.user;
        next();
    }catch(err){
        console.error(err.message);
        return res.status(401).json({errors:[{message: 'Invalid token,Please Login Again'}]});
    }
};