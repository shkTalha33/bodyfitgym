const User = require("../models/User");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -refreshTokens");
  return res.json(user);
};

const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash -refreshTokens");

  return res.json(user);
};

module.exports = { getProfile, updateProfile };
