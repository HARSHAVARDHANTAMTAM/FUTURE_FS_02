const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const Admin =
  require("../models/Admin");


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword
    });

    await admin.save();

    res.json({
      message: "Admin Registered"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const admin =
      await Admin.findOne({ email });

    if (!admin) {

      return res.status(400).json({
        message: "Admin Not Found"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Password"
      });

    }

    const token = jwt.sign(
      { id: admin._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;