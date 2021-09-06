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
      return res.status(500).json({errors:[{message:'Internal Server Error'}]})
  }

  return res.status(201).json({message:'Producted posted successfully',newProduct});

};


//Get all products posting
exports.getAllPosts=async(req,res)=>{

  try{
    const allPosts=await productModel.find({}).sort({posted: -1}).populate({path:'postedBy',select:'firstname _id'}).exec()

    if (allPosts.length === 0) {
      res.status(200).json({ message: "No Posts Found" });
    }

    return res.status(200).send(allPosts)
    

  }
  catch(err){
    console.log(err);
    return res.status(400).json({message:"Something went Wrong"});
  }

}
