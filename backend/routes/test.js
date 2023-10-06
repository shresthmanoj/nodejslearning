const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model

router.post("/login", async (req, res) => {
  try {
    const email1 = req.body.email;
    const password1 = req.body.password;

    if (!email1 || !password1) {
      return res.status(422).json({ message: "empty data" });
    }

    const result = await User.findOne({ email: email1 })

    if (result === null) {
      return res.status(401).json({ message: "email not match" });
    }

    const passwordMatch = await bcrypt.compare(password1, result.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "password not matched" });
    }

    const token2 = jwt.sign({ userid: result._id }, "secretkey");

    res.status(200).json({
      message: "login successful",
      token: token2,
      userType: result.userType,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
