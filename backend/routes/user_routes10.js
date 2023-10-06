const User = require("../models/user_model");
var bcrypt = require("bcryptjs");
const express = require("express");
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
var bodyParser = require("body-parser");

const router = express.Router();
const upload = require("../middleware/upload");

// Add express.json() middleware to parse JSON data from requests
router.use(express.json());

router.post("/register", upload.single("image"), function (req, res) {
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
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password1, salt, function (err, hash) {
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
      user.save();
      //response to browser
      res.status(200).json({ message: "register successful" });
    });
  });

  //status code->200,201,400,401,404,422,500
});

//login code
router.post("/login", function (req, res) {
  const email1 = req.body.email;
  const password1 = req.body.password;

  if (!email1 || !password1) {
    return res.status(422).json({ message: "empty data" });
  }

  User.findOne({ email: email1 })
    .then(function (result) {
      if (result === null) {
        return res.status(401).json({ message: "email not match" });
      }
      //decrypt
      // Load hash from your password DB.
      bcrypt.compare(password1, result.password, function (err, response) {
        // res === true
        if (response === false) {
          return res.status(401).json({ mesaage: "password not matched" });
        }
        var token2 = jwt.sign({ userid: result._id }, "secretkey");

        res.status(200).json({
          message: "login sucessfull",
          token: token2,
          userType: result.userType,
        });
      });
    })
    .catch(function (err) {
      res.status(500).json({ message: "server error" });
    });
});
//read all
router.get(
  "/userall",
  //auth.verfyLogin, auth.verifyVip,
  function (req, res) {
    User.find()
      .then(function (data) {
        res.status(200).json(data);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  }
);

// single user with login guard
router.get("/usersingle/:id", function (req, res) {
  const id = req.params.id;
  User.find({ _id: id })
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});
//delete
router.delete("/userdelete/:id", function (req, res) {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .then(function (response) {
      res.status(200).json({ message: "delete successful" });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

//update
router.put("/updateOne/:id", function (req, res) {
  const id = req.params.id;
  const email1 = req.body.email2;
  const password1 = req.body.password2;
  const username1 = req.body.username2;
  const userType1 = req.body.userType2;

  User.updateOne(
    { _id: id },
    {
      email: email1,
      password: password1,
      username: username1,
      userType: userType1,
    }
  )
    .then(function (response) {
      res.status(200).json({ message: "update successful" });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});
module.exports = router;
