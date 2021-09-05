const bcrypt= require('bcryptjs')
const jwt=require('jsonwebtoken')
const userModel=require('../models/User');
const {validationResult} = require('express-validator')
const {JsonWebTokenError} = require('jsonwebtoken')
require('dotenv').config();

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
            return res.status(400).json({errors:[{message:'User already registered with given email'}]})
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
            res.json({token})
        })

    }catch(err){
        console.log(`register error: ${err.message}`);
        res.status(500).json({errors:[{message:'Internal Server Error'}]})
    }
}