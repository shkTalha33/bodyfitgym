const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { isProfileComplete } = require("../utils/userProfile");

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ message: "Missing access token" });

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

/** JWT + full user doc on req.profileUser; 403 if training profile incomplete (AI features). */
const requireAuthForAi = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ message: "Missing access token" });

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-passwordHash -refreshTokens").lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    req.profileUser = user;

    if (!isProfileComplete(user)) {
      return res.status(403).json({
        code: "PROFILE_INCOMPLETE",
        message: "Complete your body and training preferences in Profile before using AI features.",
      });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

module.exports = { requireAuth, requireAuthForAi };
