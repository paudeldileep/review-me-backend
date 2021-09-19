const { validationResult } = require("express-validator");
const productModel = require("../models/Product");

exports.addNewProduct = async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const user = req.user;
  const { title, description } = req.body;

  const newProduct = new productModel({
    title,
    description,
    productImage: url + "/uploads/productImages/" + req.file.filename,
    postedBy:user.id
  });

  try{
      await newProduct.save()
      

  }catch(err){
      console.log(err)
      return res.status(500).json({errors:'Internal Server Error'})
  }

  return res.status(201).json('Product posted successfully');

};


//Get all products posting
exports.getAllPosts=async(req,res)=>{

  try{
    const allPosts=await productModel.find({}).sort({posted: -1}).populate({path:'postedBy',select:'firstname _id'}).exec()

    if (allPosts.length === 0) {
     return res.status(400).json({errors:"No Posts Found"});
    }

    return res.status(200).send(allPosts)
    

  }
  catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }

}

//Get specific user products posting
exports.getOwnPosts=async(req,res)=>{

  const{id}=req.user
  try{
    const ownPosts=await productModel.find({postedBy:id}).sort({posted: -1}).populate({path:'postedBy',select:'firstname _id'}).exec()

    if (ownPosts.length === 0) {
     return res.status(400).json({errors: "No Posts Found"});
    }

    return res.status(200).send(ownPosts)
    

  }
  catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }

}

//Get specific user products posting
exports.getPostsByUserId=async(req,res)=>{

  const userId=req.params.userId

  try{
    const allPosts=await productModel.find({postedBy:userId}).sort({posted: -1}).populate({path:'postedBy',select:'firstname _id'}).exec()

    if (allPosts.length === 0) {
     return res.status(400).json({errors: "No Posts Found"});
    }

    return res.status(200).send(allPosts)
    

  }
  catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }

}



//Get specific user products posting
exports.getSinglePost=async(req,res)=>{

  const productId=req.params.productId
  try{
    const post=await productModel.findById(productId).populate({path:'postedBy',select:'firstname _id'}).populate('reviews').exec()

    if (!post) {
     return res.status(400).json({errors: "Post Not Found"});
    }

    return res.status(200).send(post)
    

  }
  catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }

}

//delete a product
exports.deleteSinglePost=async(req,res)=>{
  const {id}=req.user;
  const productId=req.params.productId
  try{

    const product=await productModel.findById(productId)
    //console.log(product.postedBy.toString())
    if(product){
        if(product.postedBy.toString() === id){
          await product.deleteOne()
          return res.status(200).json("The product has been deleted")
        }
        else{
          return res.status(403).json({errors:"You can only delete your post"});
        }
    }
    else{
      return res.status(400).json({errors:"Specified Product Not Found"});
    }

  }catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }
}

//post a comment
exports.postReview=async(req,res)=>{
  const{id}=req.user
  const productId=req.params.productId
  const {review}=req.body

  const newReview={review,revieweddBy:id}

  try{
    const product=await productModel.findById(productId);
    
    if(product){
      // nawait product.comments.push(comment);
      await product.updateOne({ $push: { reviews: newReview } });
      return res.status(200).json("Review Posted Successfully")
    }
    else{
      return res.status(400).json({errors:"Specified Product Not Found"});
    }

  }catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }
}

 
// a like/dislike product
exports.postLike=async(req,res)=>{
  const {id}=req.user
  const productId=req.params.productId
  
  try{
    const product=await productModel.findById(productId);
    
    if (!product.likes.includes(id)) {
      await product.updateOne({ $push: { likes: id } });
      res.status(200).json("The product has been liked");
    } else {
      await product.updateOne({ $pull: { likes: id } });
      res.status(200).json("The product has been disliked");
    }

  }catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }
}

 
// a love/don't love product
exports.postHeart=async(req,res)=>{
  const {id}=req.user
  const productId=req.params.productId
  
  try{
    const product=await productModel.findById(productId);
    
    if (!product.hearts.includes(id)) {
      await product.updateOne({ $push: { hearts: id } });
      res.status(200).json("The product has been loved");
    } else {
      await product.updateOne({ $pull: { hearts: id } });
      res.status(200).json("The product has been dis-loved");
    }

  }catch(err){
    console.log(err);
    return res.status(500).json({errors:"Something went Wrong"});
  }
}
