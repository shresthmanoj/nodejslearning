// Using Node.js `require()`
const mongoose = require("mongoose");

// Using ES6 imports
//import mongoose from 'mongoose';

//import { createRequire } from "https://deno.land/std@0.177.0/node/module.ts";
//const require = createRequire(import.meta.url);

const connectdb = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/nodedatabase")

    .then(() => console.log("Connected!"))
    .catch(() => console.log("failed"));
};

module.exports = connectdb;

// ...
// const mongoose = require("mongoose");
// //configure mongoose
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/CRUD",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Connected to MongoDB");
//     }
//   }
// );
// ...
