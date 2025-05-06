const express = require("express");
const movieController = require("../controllers/movie.controller");

const router = express.Router();

router.get("/", movieController.get);
router.get("/getByUser", movieController.getByUser);
router.post("/", movieController.create);
router.put("/:id", movieController.update);
router.delete("/:id", movieController.remove);

module.exports = router;