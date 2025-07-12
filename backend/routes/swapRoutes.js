const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/", ensureAuthenticated, swapController.createSwapRequest);
router.get("/sent", ensureAuthenticated, swapController.getMySwapRequests);
router.get("/received", ensureAuthenticated, swapController.getReceivedSwapRequests);
router.get("/:id", ensureAuthenticated, swapController.getSwapRequestById);
router.patch("/:id/status", ensureAuthenticated, swapController.updateSwapRequestStatus);
router.delete("/:id", ensureAuthenticated, swapController.deleteSwapRequest);

module.exports = router;