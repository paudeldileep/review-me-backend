const mongoose = require('mongoose');
const ProductModel=require('./Product')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    products:[{type:mongoose.ObjectId,ref:'product'}],
    created: {
        type: Date,
        default: Date.now
       },
    updated: Date,
       
});

module.exports = UserModel = mongoose.model('user', userSchema);