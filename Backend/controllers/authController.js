const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { createAccessToken, createRefreshToken } = require("../utils/tokens");
const { isProfileComplete, profileCompletionPercent } = require("../utils/userProfile");
const { createUserWallet } = require("../services/circleService.js");

const publicUser = (user) => {
  const doc = user.toObject ? user.toObject() : user;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    stats: doc.stats,
    preferences: doc.preferences,
    profileComplete: isProfileComplete(doc),
    profileCompletionPercent: profileCompletionPercent(doc),
    savedPlans: doc.savedPlans || undefined,
  };
};

const signup = async (req, res) => {
  const { name, email, password } = req.validated.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const { walletId, walletAddress } = await createUserWallet();
  console.log("walletId" ,walletId);
  user.walletId = walletId;
  user.walletAddress = walletAddress;
  await user.save();

  const accessToken = createAccessToken(user._id.toString());
  const refreshToken = createRefreshToken(user._id.toString());
  user.refreshTokens.push(refreshToken);
  await user.save();

  return res.status(201).json({ user: publicUser(user), accessToken, refreshToken });
};

const login = async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = createAccessToken(user._id.toString());
  const refreshToken = createRefreshToken(user._id.toString());
  user.refreshTokens.push(refreshToken);
  await user.save();

  return res.json({ user: publicUser(user), accessToken, refreshToken });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });

  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = createAccessToken(user._id.toString());
    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { refreshTokens: refreshToken } }
    );
  }
  return res.json({ message: "Logged out successfully" });
};

module.exports = { signup, login, refresh, logout };
