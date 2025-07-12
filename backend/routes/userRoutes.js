const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.get("/", ensureAuthenticated, userController.getCurrentUser);
router.patch("/", ensureAuthenticated, userController.updateCurrentUser);
router.get("/:id", ensureAuthenticated, userController.getUserById);
router.get("/search", ensureAuthenticated, userController.searchUsers);
router.put("/skills", ensureAuthenticated, userController.updateUserSkills);

module.exports = router;