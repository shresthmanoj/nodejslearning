const express = require("express");
const router = express.Router();

router.get("/get-Category", function (req, res, next) {
  res.send("Nodejs REST API GET Method working");
});

router.post("/add-Category", function (req, res, next) {
  res.send("Nodejs REST API POST Method working");
});
router.put("/add-update-Category", function (req, res, next) {
  res.send("Nodejs REST API PUT Method working");
});
router.patch("/update-Category", function (req, res, next) {
  res.send("Nodejs REST API PATCH Method working");
});
router.delete("/delete-Category", function (req, res, next) {
  res.send("Nodejs REST API DELETE Method working");
});

module.exports = router;
