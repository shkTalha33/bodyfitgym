const Meal = require("../models/Meal");
const MealPlan = require("../models/MealPlan");
const Workout = require("../models/Workout");
const ProgressLog = require("../models/ProgressLog");
const Conversation = require("../models/Conversation");

const byType = {
  meals: Meal,
  mealPlans: MealPlan,
  workouts: Workout,
  progressLogs: ProgressLog,
  conversations: Conversation,
};

const ensureModel = (type) => byType[type];

const list = async (req, res) => {
  const Model = ensureModel(req.params.type);
  if (!Model) return res.status(404).json({ message: "Unknown resource" });
  const items = await Model.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
  return res.json(items);
};

const create = async (req, res) => {
  const Model = ensureModel(req.params.type);
  if (!Model) return res.status(404).json({ message: "Unknown resource" });
  const item = await Model.create({ ...req.body, userId: req.user.id });
  return res.status(201).json(item);
};

const update = async (req, res) => {
  const Model = ensureModel(req.params.type);
  if (!Model) return res.status(404).json({ message: "Unknown resource" });
  const item = await Model.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Record not found" });
  return res.json(item);
};

const remove = async (req, res) => {
  const Model = ensureModel(req.params.type);
  if (!Model) return res.status(404).json({ message: "Unknown resource" });
  const deleted = await Model.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Record not found" });
  return res.json({ message: "Deleted successfully" });
};

module.exports = { list, create, update, remove };
