const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/Admin");
const productModel = require("../models/Product");
const userModel = require("../models/User");

//admin register
//via postman currently

exports.adminRegister = async (req, res) => {
  const errors = validationResult(req);

  //return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  //check if admin with this email already exists or not
  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        errors: [{ msg: "admin already registered with given email" }],
      });
    }

    const newAdmin = new adminModel(req.body);

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(password, salt);

    //save new admin to database
    await newAdmin.save();

    //return json web token
    const payload = {
      admin: {
        id: newAdmin.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        return res.json(token);
      }
    );
  } catch (err) {
    console.log(`register error: ${err.message}`);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
};

//admin login
exports.adminLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (admin && bcrypt.compare(password, admin.password)) {
      //email and password matches ; create token and pass back
      const payload = {
        admin: {
          id: admin._id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "5 days",
      });

      return res.status(200).json(token);
    }
    return res
      .status(400)
      .json({ errors: [{ msg: "Invalid Login Credentials" }] });
  } catch (err) {
    console.log(`login error: ${err}`);
    return res.status(500).json({ errors: [{ msg: "Something went wrong!" }] });
  }
};

//get admin data based on token stored in localstorage
exports.adminInfo = async (req, res) => {
  const { id } = req.admin;

  try {
    const admin = await adminModel
      .findById(id)
      .select("_id name email photo")
      .exec();

    if (adminModel) {
      //console.log("userInfo"+user)
      return res.status(200).json(admin);
    }

    return res.status(500).json({ errors: [{ msg: "Something went wrong" }] });
  } catch (err) {
    console.log(`adminInfo error: ${err.message}`);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
};

//get total count of users , products and products pending approval and products approved

exports.totalCounts = async (req, res) => {
  try {
    //total products count
    const totalProductsCount = await productModel.countDocuments({});

    //total featured products count
    const totalFeaturedCount = await productModel.countDocuments({
      isFeatured: true,
    });

    //approved products count
    const approvedProductsCount = await productModel.countDocuments({
      isApproved: true,
    });

    //approvel pending products count
    const pendingProductsCount = await productModel.countDocuments({
      isApproved: false,
    });

    const usersCount = await userModel.countDocuments({});

    const counts = {
      totalProducts: totalProductsCount,
      featuredProducts: totalFeaturedCount,
      approvedProducts: approvedProductsCount,
      pendingProducts: pendingProductsCount,
      totalUsers: usersCount,
    };
    res.status(200).json(counts);
  } catch (err) {
    console.log(err);
  }
};

//top commented products (three)

exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await productModel.aggregate([
      { $unwind: "$reviews" },
      { $sortByCount: "$_id" },
      { $limit: 3 },
    ]);

    let result = [];
    await Promise.all(
      topProducts.map(async (r) => {
        const product = await productModel
          .findById(r._id)
          .select("title productImage")
          .exec();
        // console.log(product);
        // console.log(r.count);
        //const data={...product,count:r.count}

        result.push({
          _id: product._id,
          title: product.title,
          image: product.productImage,
          count: r.count,
        });
      })
    );

    //const topProducts = await productModel.find({}).count({})
    // const data= await productModel.populate(topProducts,{path:'postedBy',select:  {_id: 1, firstname: 1}})
    result.sort((a, b) => (a.count > b.count ? -1 : b.count > a.count ? 1 : 0));
    //console.log(data)
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

//users (5) with number of products posted

exports.getUsersOverview = async (req, res) => {
  try {
    const topUsers = await productModel.aggregate([
      { $group: { _id: "$postedBy", totalProducts: { $sum: 1 } } },
      { $limit: 5 },
    ]);

    let result = [];
    await Promise.all(
      topUsers.map(async (r) => {
        const user = await userModel
          .findById(r._id.toString())
          .select("firstname lastname photo")
          .exec();
        // console.log(user);
        // console.log(r.count);
        //const data={...user,count:r.count}

        result.push({
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          image: user.photo,
          count: r.totalProducts,
        });
      })
    );

    result.sort((a, b) => (a.count > b.count ? -1 : b.count > a.count ? 1 : 0));

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

//get products approved

//Get all products posting pending for approval
exports.getApprovedProducts = async (req, res) => {
  try {
    const allPosts = await productModel
      .find({ isApproved: true })
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "-password" })
      .populate("reviews")
      .populate({ path: "reviews.reviewedBy", select: "-password" })
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

//Get all products posting pending for approval
exports.getPendingProducts = async (req, res) => {
  try {
    const allPosts = await productModel
      .find({ isApproved: false })
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "-password" })
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

//Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const allPosts = await productModel
      .find({})
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "-password" })
      .populate("reviews")
      .populate({ path: "reviews.reviewedBy", select: "-password" })
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

//get details of a product pending for approval

exports.getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await productModel
      .findById(productId)
      .populate({ path: "postedBy", select: "-password" })
      .exec();

    if (!product) {
      return res.status(400).json({ errors: "Product Not Found" });
    }

    return res.status(200).send(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//approve a product posting

exports.approveProductById = async (req, res) => {
  const filter = { _id: req.params.productId };
  const update = { isApproved: true };

  try {
    let updatedProduct = await productModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (updatedProduct.isApproved === true) {
      return res.status(200).json("The product has been approved for listing");
    }
    return res.status(500).json({ errors: "Something went Wrong" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

//delete product by id

exports.deleteProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productModel.findByIdAndDelete(productId);

    if (product) {
      return res.status(200).json("The product has been removed");
    } else {
      return res.status(500).json({ errors: "Something went Wrong" });
    }
  } catch (err) {
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};

/* ********Users Related********** */

//Get specific user's products list

exports.getAllUserProducts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const allPosts = await productModel
      .find({ postedBy: userId })
      .sort({ posted: -1 })
      .populate({ path: "postedBy", select: "-password" })
      .populate("reviews")
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


// set featured true/false
exports.setFeatured = async (req, res) => {
  
  const productId = req.params.productId;

  try {
    const product = await productModel.findById(productId);

    if (product.isFeatured) {
      await product.updateOne({ isFeatured:false});
      res.status(200).json("The product removed from featured list");
    } else {
      await product.updateOne({ isFeatured:true });
      res.status(200).json("The product is set to featured");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Something went Wrong" });
  }
};
