import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    CIN: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    FirstName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    LastName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    Email: {
      type: String,
      required: true,
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
  },
  { _id: false }
);
const User = mongoose.model("User", userSchema);
export default User;
