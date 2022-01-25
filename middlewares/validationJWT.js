const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "token is missing",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    const authenticatedUser = await User.findById(uid);

    if (!authenticatedUser) {
      return res.status(401).json({ msg: "user doesn't exists" });
    }

    if (!authenticatedUser.state) {
      return res.status(401).json({
        msg: "User is not valid",
      });
    }

    req.uid = uid;
    req.authenticatedUser = authenticatedUser;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "no valid token",
    });
  }
};

module.exports = validateJWT;
