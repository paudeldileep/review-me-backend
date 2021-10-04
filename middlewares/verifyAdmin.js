const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = function(req,res,next){
    //Get token from header
    const token = req.header('x-auth-token');

    //console.log('verifyUser'+token)
    //Check if not token
    if(!token){
        return res.status(401).json({error:'Authorization failed!!'});
    }

    //verify token and assign decoded data(here currently email address) to req.user
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.admin = decoded.admin;
        next();
    }catch(err){
        console.error(err.message);
        return res.status(401).json({error:'Invalid token,Please Login Again'});
    }
};