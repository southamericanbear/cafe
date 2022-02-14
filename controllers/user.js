const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const cloudinaryUpload = require("../utils/cloudinary-upload");

const usersGet = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

const createUser = async (req, res = response) => {
  const { name, email, id, password, rol } = req.body;
  const protoUser = { name, email, id, password, rol };

  if (req.files) {
    protoUser.img = await cloudinaryUpload(req.files.file);
  } else {
    protoUser.img = `https://avatars.dicebear.com/api/male/${name}.svg?background=%230000ff`;
  }

  const user = new User(protoUser);

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);
  try {
    await user.save();
    console.log("user created");
    res.status(200).json({
      msg: "User successfully created",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "error",
    });
  }
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, email, google, ...payload } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync();
    payload.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, payload);

  res.status(200).json({
    msg: "User updated",
    user,
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { state: false });

  res.status(200).json({ user });
};

const usersPatch = (req, res = response) => {
  res.status(200).json({
    msg: "patch users",
  });
};

module.exports = {
  usersGet,
  createUser,
  usersPut,
  usersDelete,
  usersPatch,
};
