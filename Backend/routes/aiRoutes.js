const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { requireAuthForAi } = require("../middleware/authMiddleware");

router.post("/diet-plan", requireAuthForAi, aiController.generateDietPlan);
router.post("/weekly-meals", requireAuthForAi, aiController.generateWeeklyMeals);
router.post("/workout-plan", requireAuthForAi, aiController.generateWorkoutPlan);
router.post("/coach", requireAuthForAi, aiController.aiCoach);

module.exports = router;
