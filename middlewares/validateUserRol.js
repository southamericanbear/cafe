const { request, response } = require("express");

const isAdmin = (req = request, res = response, next) => {
  const authenticatedUser = req.authenticatedUser;

  if (authenticatedUser.rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: "Only admin users can delete users",
    });
  }

  next();
};

const haveRol = (...roles) => {
  return (req = request, res = response, next) => {
    const authenticatedUser = req.authenticatedUser;

    if (!authenticatedUser) {
      return res.status(500).json({
        msg: "trying to verify role withou token",
      });
    }

    if (!roles.includes(authenticatedUser.rol)) {
      return res.status(401).json({
        msg: `the service requires one of this roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = { isAdmin, haveRol };
