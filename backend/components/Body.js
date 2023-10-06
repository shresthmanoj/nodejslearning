const Sdata = require("../data/Sdata");
const express = require("express");
const router2 = express.Router();

router2.get("/body", function (req, res) {
  const Body = Sdata.map(function (response) {
    {
      response.title;
    }
    {
      response.id;
    }
    {
      response.name;
    }
    {
      response.subject[1];
    }
    {
      response.car.name;
    }

    {
      response.data.map(function (res) {
        {
          res.name;
        }
        {
          res.title;
        }
        {
          res.id;
        }
      });
    }
  });
});

module.exports = router2;
