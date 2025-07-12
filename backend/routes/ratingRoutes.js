const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", ensureAuthenticated, ratingController.createRating);
router.get("/given", ensureAuthenticated, ratingController.getRatingsGiven);
router.get("/received", ensureAuthenticated, ratingController.getRatingsReceived);
router.get("/user/:userId", ensureAuthenticated, ratingController.getRatingsForUser);
router.patch("/:id", ensureAuthenticated, ratingController.updateRating);
router.delete("/:id", ensureAuthenticated, ratingController.deleteRating);

module.exports = router;