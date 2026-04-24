const jwt = require("jsonwebtoken");
const env = require("../config/env");

const createAccessToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtAccessExpiresIn });

const createRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

module.exports = { createAccessToken, createRefreshToken };
