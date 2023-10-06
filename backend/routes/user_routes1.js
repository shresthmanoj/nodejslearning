const User = require("../models/user_model");
var bcrypt = require("bcryptjs");
const express = require("express");
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
var bodyParser = require("body-parser");

const router1 = express.Router();
const upload = require("../middleware/upload");

// Add express.json() middleware to parse JSON data from requests
router1.use(express.json());

router1.post("/register", upload.single("image"), async (req, res) => {
  try {
    //req data
    const username1 = req.body.username;
    const email1 = req.body.email;
    const password1 = req.body.password;
    const userType1 = req.body.userType;
    const image = req.file.filename;
    //validation
    if (!username1 || !email1 || !password1 || !userType1) {
      return res.status(422).json({ message: "empty data" });
    }

    //password encry
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password1, salt);
    // Store hash in your password DB.

    //class to object create

    const user = new User({
      username: username1,
      email: email1,
      password: hash, //random password store in database
      userType: userType1,
      image: image,
    });
    //database save
    await user.save();
    //response to browser
    res.status(200).json({ message: "register successful" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
  //status code->200,201,400,401,404,422,500
});

//login code
router1.post("/login", async (req, res) => {
  try {
    const email1 = req.body.email;
    const password1 = req.body.password;

    if (!email1 || !password1) {
      return res.status(422).json({ message: "empty data" });
    }

    const result = await User.findOne({ email: email1 });
    if (result === null) {
      return res.status(401).json({ message: "email not match" });
    }
    //decrypt
    // Load hash from your password DB.
    const passwordMatch = await bcrypt.compare(password1, result.password);
    // res === true
    if (!passwordMatch) {
      return res.status(401).json({ mesaage: "password not matched" });
    }

    const token2 = jwt.sign({ userid: result._id }, "secretkey");

    res.status(200).json({
      message: "login sucessfull",
      token: token2,
      userType: result.userType,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});
//read all
router1.get("/userall", auth.verfyLogin, auth.verifyVip, async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// single user with login guard
router1.get("/usersingle/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.find({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//delete
router1.delete("/userdelete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await User.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "delete successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update
router1.put("/updateOne/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const email1 = req.body.email2;
    const password1 = req.body.password2;
    const username1 = req.body.username2;
    const userType1 = req.body.userType2;

    const userUpdate = await User.updateOne(
      { _id: id },
      {
        email: email1,
        password: password1,
        username: username1,
        userType: userType1,
      }
    );
    if (userUpdate.nModified === 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "update successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router1;
