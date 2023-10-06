const express = require("express"); 
const router = express. Router();

// mongodb user model
const User = require("./../models/User");

// mongodb user verification model
const UserVerification = require("./../models/UserVerification");

// mongodb user otp verification model
const UserOTPVerification = require("./../models/UserOTPVerification");

// mongodb user model
const PasswordReset = require("./../models/PasswordReset");

// email handler
const nodemailer = require("nodemailer");
// unique string
const {v4: uuidv4 } =
require("uuid");

// Password handler
const bcrypt = require("bcrypt");

//Env verification
require("dotenv").config()

// path for static verified page
const path = require("path");

// Nodemailer stuff
let transporter = nodemailer.createTransport({
host: "smtp-mail.outlook.com",
auth: {
user: process.env.AUTH_EMAIL, 
pass: process.env.AUTH_PASS,
},
});

// testing success
transporter.verify((error, success) => {
if (error) {
console.log(error);
} else {
console.log("Ready for messages");
console.log(success);
}
});

// setting sever url
const development = "http://localhost:5000/"; 
const production = "https://radiant-meadow-44726.herokuapp.com/"; 
const currentUrl = process.env.NODE_ENV ? production: development;

// Signup
router.post("/signup", (req, res) => {
let { name, email, password, dateOfBirth } = req.body; 
name = name.trim();
email = email.trim();
password = password.trim();
dateOfBirth = dateOfBirth.trim();

if (name =="" || email == "" || password=="" || dateOfBirth==""){
res.json({
status: "FAILED",
message: "Empty input fields!",
 });
} else if (!/^[a-zA-Z]*$/.test(name)) {
res.json({
status: "FAILED",
message: "Invalid name entered",
});
} else if (!/^[\w-\-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
res.json({
status: "FAILED",
message: "Invalid email entered",
});
} else if (!newdate(dateOfBirth).getTime()) {
    res.json({
        status: "FAILED",
message: "Invalid date of birth entered",        
    });
} else if(password.length<8){
    res.json({
        status:"FAILED",
        message:"Password id too short"
    })
} else {
// Checking if user already exists 
User.find({ email })
.then((result) => {
if (result.length) {
// A user already exists
res.json({
status: "FAILED",
message: "User with the provided email already exists",
});
} else {
//Try to create new user'

//password handling
const saltRound=10
bcrypt
.hash(password, saltRound)
.then((hashedPassword)=>{
    const newUser = new User({
        name,
        email,
        password,
        dateOfBirth,
        verfied:false,
    })

newUser
.save()
.then((result) => {
// Handle account verification 
//sendVerificationEmail (result, res);
sendOTPVerificationEmail(result, res)
})
.catch((err) => {
console.log(err);
res.json({
status: "FAILED",
message: "An error occurred while saving user account!",
});
});
})
.catch((err) => {
res.json({
status: "FAILED",
message: "An error occurred while hashing password!",
});
});
}
})
.catch((err) =>{
    console.log(err)
    res.json({
        status:"FAILED",
        message:"An error occured while checking for existing user!"
    })
})
}
})



// send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
try {
const otp = `${Math.floor(1000+ Math.random()*9000)}`
// mail options
const mailOptions = {
from: process.env.AUTH_EMAIL,
to: email,
subject: "Verify Your Email",
html: `<p>Enter <b>${otp}</b> in the app to verify your email address and comple p><p>This code <b>expires in 1 hour</b>.</p>`, 
}
//hash the OPT
const saltRound =10
const hashedOTP= await bcrypt.hash(opt,saltRound)
const newOTPVerification = await new UserOTPVerification({
    userId: _id,
    opt: hashesOPT,
    createdAt: Date.now(),
    expiresAt: Date.now() = 3600000,
});
//save otp record
await newOTPVerification.save();
await transporter.sendMail(mailOptions);
res.json({
    status:"PENDING",
    message:"Verification opt email sent",
    data:{
        userId: _id,
        email,
    }
})
} catch (error) {
    res.json({
        status:"FAILED",
        message:error.message,
    })
}
};




// Verify otp email
router.post("/verifyOTP", async (req, res) => {
try {
let {userId, otp } = req.body;
if (!userId || !otp) {
throw Error("Empty otp details are not allowed");
} else {
const UserOTPVerificationRecords = await UserOTPVerification.find({
userId,
});
if (UserOTPVerificationRecords.length <= 0) {
// no record found
throw new Error(

"Account record doesn't exist or has been verified already. Please sign up")
} else {
// user otp record exists
const {expiresAt } = UserOTPVerificationRecords[0]; 
const hashedOTP = UserOTPVerificationRecords[0].otp;

if (expiresAt< Date.now()) {
// user otp record has expired
await UserOTPVerification.deleteMany ({ userId });
throw new Error("Code has expired. Please request again.");
}else{
    const validOPT = await bcrypt.compare(opt, hashedOTP);

    if(!validOPT){
        //supplied opt is wrong
        throw new error("Invalid code entered. Check your inbox.")
    } else{
        //success
        await User.updateOne({_id:UserId}, {verfied:true});
        await UserOTPVerification.deleteMany({userId})
        res.json({
            status:"VERIFIED",
            message:`User email verified sucessfully.`,
        })
    }
}
}
}

} catch(error){
    res.json({
        status:"FAILED",
        message:"error.message"
    });

}
}) 

// resend verification
router.post("/resendOTPVerificationCode", async (req, res) => {
try {
let { userId, email } = req.body;
if (!userId || !email) {
throw Error("Empty user details are not allowed");
} else {
// delete existing records and resend
await UserOTPVerification.deleteMany({userId});
sendOTPVerificationEmail({_id:userId, email})
}
}catch (error) {
    res.json({
        status:"FAILED",
        message:error.message,
    })
}
});