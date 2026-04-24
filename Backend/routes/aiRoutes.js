const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/diet-plan", aiController.generateDietPlan);
router.post("/workout-plan", aiController.generateWorkoutPlan);
router.post("/coach", aiController.aiCoach);

module.exports = router;
