
const { body, validationResult } = require("express-validator");
const { checkValidation } = require("../util/helpers");
const jwt = require("jsonwebtoken");
const HttpError = require("../util/HttpError");
const userModel = require("../models/user.model");

const singUp = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 4 })
    .withMessage("Enter name"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").not().isEmpty().withMessage("Password can't be empty"),
  body("password_repeat")
    .not()
    .isEmpty()
    .withMessage("Password can't be empty"),
  body("password")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("password")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase character"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase character"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { name, email, password, password_repeat } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      throw new HttpError("Email is in use", 400);
    }
    if (password !== password_repeat) {
      throw new HttpError("Passwords do not match", 400);
    }

    const record = new userModel({ name, email });
    record.setPassword(password);
    await record.save();

    res.status(201).send({ email: record.email });
  },
];

const singIn = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").not().isEmpty().withMessage("Password can't be empty"),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      throw new HttpError("Invalid credentials!", 400);
    }
    if (!existingUser.checkPassword(password)) {
      throw new HttpError("Invalid credentials!", 400);
    }
    const token = jwt.sign(
      {
        userId: existingUser.id,
        userName: existingUser.name,
      },
      process.env.API_KEY
    );
    res.send({ token });
  },
];

module.exports = {
  singUp,
  singIn,
};