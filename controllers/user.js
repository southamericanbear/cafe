const { response, request } = require("express");

const usersGet = (req = request, res = response) => {
  const { name, password } = req.query;

  res.status(200).json({
    msg: "get users",
    name,
    password,
  });
};

const usersPost = (req, res = response) => {
  const { name, email, password } = req.body;
  res.status(200).json({
    msg: "post users",
    name,
    email,
    password,
  });
};

const usersPut = (req = request, res = response) => {
  const id = req.params.id;

  res.status(200).json({
    msg: "put users",
    id,
  });
};

const usersDelete = (req, res = response) => {
  res.status(200).json({
    msg: "delete users",
  });
};

const usersPatch = (req, res = response) => {
  res.status(200).json({
    msg: "patch users",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
};
