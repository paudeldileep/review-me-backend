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
      return res
        .status(409)
        .json({
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

//get total count of users , products and todo: products pending approval

exports.totalCounts = async (req, res) => {
  try {
    const productsCount = await productModel.countDocuments({});

    const usersCount = await userModel.countDocuments({});

    const counts={
        totalProducts:productsCount,
        totalUsers:usersCount
    }
    res.status(200).json(counts);
  } catch (err) {
    console.log(err);
  }
};
