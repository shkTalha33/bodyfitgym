const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, recordWorkoutProgress } = require("../controllers/userController");

const router = express.Router();

router.get("/me", requireAuth, getProfile);
router.patch("/me", requireAuth, updateProfile);
router.post("/me/workout-progress", requireAuth, recordWorkoutProgress);

module.exports = router;
