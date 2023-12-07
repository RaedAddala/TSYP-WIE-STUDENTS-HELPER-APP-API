import { Router } from "express";
import User from "../models/User.js";
import { validate } from "deep-email-validator";

const authRouter = Router();
// VALIDATION  Functions:
import { RegisterValidation, LoginValidation } from "../utils/validation.js";
import { GetHashAndSalt, CompareHashAndPass } from "../utils/crypt.js";

authRouter.post("/signup", async (req, res) => {
  // Let's validate data before create a user
  const error = RegisterValidation(req.body);
  if (error) {
    return res
      .status(400)
      .json({ request: req.body, message: error.details[0].message });
  }

  /*
   * Verify if mail, CIN already exists or not
   * Verify if mail is valid
   */
  const mailValidPromise = validate(req.body.email);
  const emailExistPromise = User.findOne({ Email: req.body.email });
  const CINExistPromise = User.findOne({ CIN: req.body.CIN });

  const isMailValid = await mailValidPromise;
  const isEmailExist = await emailExistPromise;
  const isCINExist = await CINExistPromise;

  if (!isMailValid.valid) {
    return res.status(400).json({
      error: "Email is not valid. Please try again!",
      reason: isMailValid.reason,
    });
  }
  if (!isEmailExist) {
    return res.status(400).json({
      error: "Email already exists!",
    });
  }
  if (!isCINExist) {
    return res.status(400).json({
      error: "CIN already exists!",
    });
  }

  // hashing password
  const { salt, password } = GetHashAndSalt(req.body.Password);

  // creating new user
  const user = new User({
    CIN: req.body.CIN,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: password,
    Salt: salt,
  });

  try {
    await user.save();
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(400).json({ message: "[Error Saving User] :" + err });
  }
});
authRouter.post("/login", async (req, res) => {
  // Can authorize either using CIN or Email:
  const error = LoginValidation(req.body);
  if (error) {
    return res
      .status(400)
      .json({ request: req.body, message: error.details[0].message });
  }

  // Check depending on which field is given whether the user exists or not:
  let query = { Email: req.body.Email };
  if (req.body.CIN) query = { CIN: req.body.CIN };
  const user = await User.findOne(query);
  if (!user || !CompareHashAndPass(password, user.password, user.salt)) {
    return res.status(400).send("Email or Password is wrong");
  }
  res.status(200).send("Logged IN");
});

export default authRouter;
