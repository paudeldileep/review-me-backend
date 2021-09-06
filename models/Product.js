const mongoose = require("mongoose");
const UserModel = require("./User");

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
    ref: UserModel,
    required: true,
  },
  posted: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

module.exports = ProductModel = mongoose.model("product", productSchema);
