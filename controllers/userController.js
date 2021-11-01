const bcrypt= require('bcryptjs')
const jwt=require('jsonwebtoken')
const userModel=require('../models/User');
const {validationResult} = require('express-validator')
//const {JsonWebTokenError} = require('jsonwebtoken')
require('dotenv').config();


//get user data based on token stored in localstorage
exports.userInfo=async(req,res)=>{
    const {id}=req.user

    try{
 
        const user=await userModel.findById(id).select('_id firstname email photo').exec()

        if(user){
            //console.log("userInfo"+user)
            return res.status(200).json(user);
        }

        return res.status(500).json({errors:'Something went wrong'})

    }catch(err){
        console.log(`userInfo error: ${err.message}`);
        return res.status(500).json({errors:'Internal Server Error'})
    }
}

exports.userRegister=async(req,res)=>{
    const errors=validationResult(req)

    //return validation errors if any
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} =req.body

    //check if user with this email already exists or not
    try{
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(409).json({errors:[{msg:'User already registered with given email'}]})
        }

        const newUser= new userModel(req.body);

        //encrypt password
        const salt=await bcrypt.genSalt(10)
        newUser.password= await bcrypt.hash(password,salt)
        
        //save new user to database
        await newUser.save()

        //return json web token
        const payload={
            user:{
                id:newUser.id
            }
        }
        jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'5 days'},(err,token)=>{
            if(err) throw err
           return res.json(token)
        })

    }catch(err){
        console.log(`register error: ${err.message}`);
        return res.status(500).json({errors:[{msg:'Internal Server Error'}]})
    }
}



exports.userLogin=async(req,res)=>{

    const errors=validationResult(req)

    //return validation errors if any
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password}=req.body

    try{
    //check whether given email matches in db or not
    const user=await userModel.findOne({email})

    if(user && await bcrypt.compare(password,user.password)){
        //email and password matches ; create token and pass back
        const payload={
            user:{
                id:user._id
            }
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'5 days'})

        //const userdata={_id:user._id,firstname:user.firstname,email,token}
       //console.log(user,token)

        return res.status(200).json(token)

    }

    return res.status(400).json({errors:[{msg:'Invalid Login Credentials'}]})
    }catch(err){
        console.log(`login error: ${err}`)
        return res.status(500).json({errors:[{msg:'Something went wrong!'}]})
    }

}

//get all users

exports.getAllUsers=async(req,res)=>{

    try{
        const users=await userModel.find({}).select('-password')
        if(users){
            return res.status(200).json(users)
        }
        return res.status(400).json({errors:"No users Found"})
    }catch(err){
        console.log(`get all users error: ${err}`);
        return res.status(500).json({errors:"Something went wrong"})
    }

}


//get a user profile based on userId

exports.getUserProfile=async(req,res)=>{

    const userId=req.params.userId;

    try{
        const userProfile=await userModel.findById(userId).select('-password').exec()
        if(userProfile){
            return res.status(200).json(userProfile)
        }
        return res.status(400).json({errors:"No user Found"})
    }catch(err){
        console.log(`get all users error: ${err}`);
        return res.status(500).json({errors:"Something went wrong"})
    }

}