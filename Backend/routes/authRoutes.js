const express = require("express");
const { signup, login, refresh, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { authSignupSchema, authLoginSchema } = require("../validation/schemas");

const router = express.Router();

router.post("/signup", validate(authSignupSchema), signup);
router.post("/login", validate(authLoginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);

module.exports = router;
