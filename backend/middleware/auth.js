const User = require("../models/user_model");

const jwt = require("jsonwebtoken");

//login verify
module.exports.verfyLogin = function (req, res, next) {
  const token = req.headers.authorization;
  const token_split = token.split(" ")[1];
  var decoded = jwt.verify(token_split, "secretkey");

  User.findOne({ _id: decoded.userid })
    .then(function (response) {
      req.UserInfo = response;
      //break
      next();
    })
    .catch(function (error) {
      res.status(500).json({ message: error.message });
    });
};

// verfiy admin
module.exports.verifyAdmin = function (req, res, next) {
  if (!res.UserInfo) {
    return res.status(401).json({ message: "user admin" });
  } else if (res.UserInfo.userType !== "Admin") {
    res.status(401).json({ message: "user is not admin" });
  }
  next();
};

module.exports.verifyVip = function (req, res, next) {
  if (!res.UserInfo) {
    return res.status(401).json({ message: " vip.message" });
  } else if (res.UserInfo.userType !== "Vip") {
    res.status(401).json({ message: "user is not Vip" });
  }
  next();
};
module.exports.verifyUser = function (req, res, next) {
  if (!res.UserInfo) {
    return res.status(401).json({ message: "user.message" });
  } else if (res.UserInfo.userType !== "User") {
    res.status(401).json({ message: "user is not user" });
  }
  next();
};
