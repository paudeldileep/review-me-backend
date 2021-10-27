const mongoose = require("mongoose");
const Schema=mongoose.Schema

const UserModel = require("./User");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  productImage: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ type: mongoose.ObjectId, ref: 'user' }],
  hearts: [{ type: mongoose.ObjectId, ref: 'user' }],
  reviews: [reviewSchema],
  posted: {
    type: Date,
    default: Date.now,
  },
  isApproved:{
    type:Boolean,
    default:false
  },
  isFeatured:{
    type:Boolean,
    default:false
  },
  updated: Date,
});

module.exports =ProductModel = mongoose.model("product", productSchema);
//exports.CommentModel = mongoose.model("comment", commentSchema);
