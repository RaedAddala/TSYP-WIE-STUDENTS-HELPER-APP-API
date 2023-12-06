import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  CIN: {
    type: String,
    index: true,
    required: true,
    unique: true,
    index: true,
  },
  FirstName: {
    type: String,
    required: true,
    min: 2,
    max: 60,
  },
  LastName: {
    type: String,
    required: true,
    min: 2,
    max: 60,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    min: 6,
    max: 255,
  },
  Password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
export default User;
