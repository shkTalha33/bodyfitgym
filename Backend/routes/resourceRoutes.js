const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { list, create, update, remove } = require("../controllers/resourceController");

const router = express.Router();

router.use(requireAuth);
router.get("/:type", list);
router.post("/:type", create);
router.patch("/:type/:id", update);
router.delete("/:type/:id", remove);

module.exports = router;
