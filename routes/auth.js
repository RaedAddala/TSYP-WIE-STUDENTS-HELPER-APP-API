import { Router } from "express";
import User from "../models/User.js";
const authRouter = Router();
// VALIDATION :
import Joi from "@hapi/joi";

const ValidationSchema = Joi.object({
  CIN: Joi.number().required().min(10000000).max(29999999),
  FirstName: Joi.string().required().min(2).max(60),
  LastName: Joi.string().required().min(2).max(60),
  Email: Joi.string().email().required().min(6).max(255),
  Password: Joi.string().required().min(8).max(40),
});

authRouter.post("/signup", async (req, res) => {
  // Let's validate data before create a user
  const { error } = ValidationSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ request: req.body, message: error.details[0].message });
  }

  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(400).json({ message: "[Error Saving User] :" + err });
  }
});
authRouter.post("/login", (req, res) => {
  // Can authorize either using CIN or Email:
  const ValidationSchema = Joi.object({
    CIN: Joi.number().min(10000000).max(29999999),
    Email: Joi.string().email().min(6).max(255),
    Password: Joi.string().required().min(8).max(40),
  }).xor("CIN", "Email");

  const { error } = ValidationSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ request: req.body, message: error.details[0].message });
  }
  res.json(req.body);
});

export default authRouter;
