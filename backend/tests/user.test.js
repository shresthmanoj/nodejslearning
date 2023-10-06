const User = require("../models/user_model");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/nodedatabase";

// use the new name of the databaseconsturl= 'mongodb://localhost:27017/new_database_name';
beforeAll(async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
/* describe('Product  Schema testanything', () =>{// the code below is for insert testing
it("Add product testinganything", () => {
  const user = {
    username: "Nokia2",
    email: "nokia@gmail.com",
    password: "nokia123",
    userType: "User",
    avatar: "image",
  };
  return User.create(user).then((val) => {
    expect(val.username).toEqual("Nokia2");
  });
 }); */

/*
//the code below is for delete testing
it("to test the delete product is working or not", async () => {
  const statusCode = await User.findByIdAndDelete({
    _id: Object("6501cc23c5e05e0a2cd36997"),
  });

  expect(statusCode.acknowledged).toBe(true);
});
*/

it("to test the update", async () => {
  return User.findOneAndUpdate(
    { _id: Object("64ff11a9862e7ba3bae1f2bb") },
    { $set: { username: "Nokia1" } }
  ).then((pp) => {
    expect(pp.username).toEqual("Nokia1");
  });
});

/*it('to test the delete product is working or not', async() =>{
   const statusCode= await User.deleteMany();
 expect(statusCode.acknowledged).toBe(true);
 });  */
