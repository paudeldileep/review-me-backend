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
    postedBy: user.id,
  });

  try {
    await newProduct.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Internal Server Error" });
  }

  return res.status(201).json("Product posted successfully");
};

//Get all approved products posting 
exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await productModel
      .find({isApproved:true})
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "firstname _id" })
      .exec();

    if (allPosts.length === 0) {
      return res.status(400).json({ errors: "No Posts Found" });
    }

    return res.status(200).send(allPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//Get all products posting pending for approval
exports.getAllPendingPosts = async (req, res) => {
  try {
    const allPosts = await productModel
      .find({isApproved:false})
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "firstname _id" })
      .exec();

    if (allPosts.length === 0) {
      return res.status(400).json({ errors: "No Posts Found for Approval" });
    }

    return res.status(200).send(allPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//Get specific user products posting
exports.getOwnPosts = async (req, res) => {
  const { id } = req.user;
  try {
    const ownPosts = await productModel
      .find({ postedBy: id })
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "firstname _id" })
      .exec();

    if (ownPosts.length === 0) {
      return res.status(400).json({ errors: "No Posts Found" });
    }

    return res.status(200).send(ownPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//Get specific user products posting
exports.getPostsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const allPosts = await productModel
      .find({ postedBy: userId })
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "firstname _id" })
      .exec();

    if (allPosts.length === 0) {
      return res.status(400).json({ errors: "No Posts Found" });
    }

    return res.status(200).send(allPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//Get specific user products posting
exports.getSinglePost = async (req, res) => {
  const productId = req.params.productId;
  try {
    const post = await productModel
      .findById(productId)
      .populate({ path: "postedBy", select: "firstname _id" })
      .populate("reviews")
      .exec();

    if (!post) {
      return res.status(400).json({ errors: "Post Not Found" });
    }

    return res.status(200).send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//delete a product
exports.deleteSinglePost = async (req, res) => {
  const { id } = req.user;
  const productId = req.params.productId;
  try {
    const product = await productModel.findById(productId);
    //console.log(product.postedBy.toString())
    if (product) {
      if (product.postedBy.toString() === id) {
        await product.deleteOne();
        return res.status(200).json("The product has been deleted");
      } else {
        return res
          .status(403)
          .json({ errors: "You can only delete your post" });
      }
    } else {
      return res.status(400).json({ errors: "Specified Product Not Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//update a product
exports.updateSinglePost = async (req, res) => {
  const { id } = req.user;
  const productId = req.params.productId;

  const url = req.protocol + "://" + req.get("host");

  const { title, description } = req.body;

  let newProduct = {
    title,
    description,
    updated:Date.now()
  };

  if (req.file) {
    newProduct.productImage =
      url + "/uploads/productImages/" + req.file.filename;
  }

  try {
    const product = await productModel.findById(productId);
    //console.log(product.postedBy.toString())
    if (product) {
      if (product.postedBy.toString() === id) {
        await product.updateOne({ $set: newProduct });
        return res.status(200).json("The product has been updated");
      } else {
        return res.status(403).json({ errors: "You can only edit your post" });
      }
    } else {
      return res.status(400).json({ errors: "Specified Product Not Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//post a comment
exports.postReview = async (req, res) => {
  const { id } = req.user;
  const productId = req.params.productId;
  const { review } = req.body;

  const newReview = { review, reviewedBy: id };

  try {
    const product = await productModel.findById(productId);

    if (product) {
      // nawait product.comments.push(comment);
      await product.updateOne({ $push: { reviews: newReview } });
      return res.status(200).json("Review Posted Successfully");
    } else {
      return res.status(400).json({ errors: "Specified Product Not Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//get all reviews of a product

exports.getReviews = async (req, res) => {
  const productId = req.params.productId;

  try {
    const reviews = await productModel
      .findById(productId)
      .select("reviews")
      .populate("reviews")
      .populate({ path: "reviews.reviewedBy", select: "firstname lastname" })
      .exec();
    if (reviews) {
      return res.status(200).json(reviews);
    }
    return res.status(400).json({ errors: "No Reviews Yet.." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

// a like/dislike product
exports.postLike = async (req, res) => {
  const { id } = req.user;
  const productId = req.params.productId;

  try {
    const product = await productModel.findById(productId);

    if (!product.likes.includes(id)) {
      await product.updateOne({ $push: { likes: id } });
      res.status(200).json("The product has been liked");
    } else {
      await product.updateOne({ $pull: { likes: id } });
      res.status(200).json("The product has been disliked");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

// a love/don't love product
exports.postHeart = async (req, res) => {
  const { id } = req.user;
  const productId = req.params.productId;

  try {
    const product = await productModel.findById(productId);

    if (!product.hearts.includes(id)) {
      await product.updateOne({ $push: { hearts: id } });
      res.status(200).json("The product has been loved");
    } else {
      await product.updateOne({ $pull: { hearts: id } });
      res.status(200).json("The product has been dis-loved");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//get count of monthly products posted

exports.getMonthlyProductCount = async (req, res) => {
  try {
    const monthlyPC = await productModel
      .aggregate([
        // {
        //   $group: { _id: { $month: "$posted"}, totalProducts: { $sum: 1 } },
        // },
        // { $project: { xAxis:"$_id", year:{$year: "$posted"}, yAxis: "$totalProducts" } },
        {
          $group: {
            _id: {
              year: {$year:'$posted'},
              month: {$month:'$posted'},

            },
            totalProducts: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            totalProducts:'$totalProducts'
          }
        }
      ])
      .exec();

    if (monthlyPC) {
      return res.status(200).json(monthlyPC);
    }

    return res.status(400).json({ errors: [{ msg: "No Products Found.." }] });
  } catch (err) {
    console.log(err);
  }
};

//get current months products

exports.getCMProductsCount = async (req, res) => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const week = new Date();
  week.setUTCHours(0, 0, 0, 0);
  week.setDate(week.getDate() - 6);

  try {
    // const cmProductsCount=await productModel.aggregate([
    //   {
    //     $match:{posted:{$gte:firstDay, $lt:lastDay}}
    //   },
    //   {
    //     $group:{_id:{$month:"$posted"},totalProducts:{$sum:1}}
    //   }
    // ])

    const cmProducts = await productModel.aggregate([
      {
        $facet: {
          month: [
            {
              $match: { posted: { $gte: firstDay, $lt: lastDay } },
            },
            {
              $group: {
                _id: { $month: "$posted" },
                totalProducts: { $sum: 1 },
              },
            },
          ],
          today:[
            {
              $match: { posted: { $gte: today, $lt: tomorrow } },
            },
            {
              $group: {
                _id: "today",
                totalProducts: { $sum: 1 },
              },
            },
          ],
          week:[
            {
              $match: { posted: { $gte: week, $lt: today } },
            },
            {
              $group: {
                _id:"week",
                totalProducts: { $sum: 1 },
              },
            },
          ]
        },
      },
    ]);

    if (cmProducts) {

      const cmProductsCount={
        month:cmProducts[0].month[0],
        today:cmProducts[0].today[0],
        week:cmProducts[0].week[0],
      }
      return res.status(200).json(cmProductsCount);
    }
  } catch (err) {
    console.log(err);
  }
};
