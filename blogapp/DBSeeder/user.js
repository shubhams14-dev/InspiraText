const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
dotenv = require("dotenv")
dotenv.config()
var UserSchema = new mongoose.Schema(
{
name: {
type: String,
required: [true, "Please Provide Name."],
minlength: 3,
maxlength: 50,
},
email: {
type: String,
required: [true, "Please provide email."],
match: [
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]*)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[a-zA-Z]{2,})$/,
        "Please provide valid email.",
],
unique: true,
},
password: {
type: String,
required: [true, "Please provide password."],
minlength: 8,
},
bio: {
type: String,
maxlength: 150,
},
profileImage: {
type: String,
default: "https://res.cloudinary.com/blogmind/image/upload/v1631725901/default-profile.png",
},
blogs: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "Blog",
},
],
myInterests: [
{
type: String,
},
],
readArticles: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "Blog",
},
],
following: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
],
followers: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
],
status: {
type: String,
enum: ["active", "inactive", "blocked"],
default: "active",
},
otp: {
value: {
type: String,
},
expires: {
type: Date,
},
},
},
{ timestamps: true },
)
UserSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.methods.generateToken = function () {
    return jwt.sign(
      { userId: this._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  };
  
  UserSchema.methods.comparePassword = async function (pswrd) {
    const isMatch = await bcrypt.compare(pswrd, this.password);
    return isMatch;
  };
  
  module.exports = mongoose.model("User", UserSchema);