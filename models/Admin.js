const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    created: {
        type: Date,
        default: Date.now
       },
    updated: Date,
});

module.exports = AdminModel =mongoose.model('admin',adminSchema)