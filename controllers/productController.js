const { validationResult } = require("express-validator");
const productModel = require("../models/Product");

exports.addNewProduct = async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const user = req.user;
  const { title, description } = req.body;

  const newProduct = new productModel({
    title,
    description,
    productImage: url + "/public/uploads/productImages" + req.file.filename,
    postedBy:user.id
  });

  try{
      await newProduct.save()
  }catch(err){
      console.log(err)
  }

  console.log(newProduct);
};
