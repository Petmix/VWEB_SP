const { body, validationResult, matchedData } = require("express-validator");
const movieModel = require("../models/movie.model");
const HttpError = require("../util/HttpError");
const { checkValidation } = require("../util/helpers");

const get = async (req, res) => {
  const records = await movieModel.find();
  res.send(records);
};

const getByUser = async (req, res) => {
  const records = await movieModel.find({ userId: req.user.userId });
  res.send(records);
};

const create = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 1 })
    .withMessage("Name should not be empty."),
  body("description").not().isEmpty().isLength({ min: 20 }).withMessage("Description should have at least 20 characters."),
  body("releaseDate").isNumeric().not().isEmpty(),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { name, description, releaseDate } = req.body;

    const record = new movieModel({
      name,
      description,
      releaseDate
    });
    try {
      await record.save();
    } catch (error) {
      throw new HttpError(`Database error: ${error.message}`, 500);
    }
    res.status(201).send(record);
  },
];

const update = [
  body("name")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Name should not be empty."),
  body("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Description should have at least 20 characters."),
  body("releaseDate").isNumeric(),
  async (req, res) => {
    checkValidation(validationResult(req));
    const matched = matchedData(req, {
      onlyValidData: true,
    });
    const record = await movieModel.findById(req.params.id);
    if (!record) {
      throw new HttpError("Movie does not exists!", 404);
    }
    try {
      await record.save();
    } catch (error) {
      throw new HttpError(`Database error: ${error.message}`, 500);
    }
    res.send({});
  },
];

const remove = async (req, res) => {
  try {
    await movieModel.findByIdAndDelete(req.params.id);
  } catch (error) {
    throw new HttpError(`Database error: ${error.message}`, 500);
  }
  res.status(200).send({});
};
module.exports = {
  get,
  getByUser,
  create,
  update,
  remove,
};