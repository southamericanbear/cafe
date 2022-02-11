const role = require("../models/role");
const User = require("../models/User");

const roleValidator = async (rol = "") => {
  const existRole = await role.findOne({ rol });
  if (!existRole) {
    throw new Error(`The role ${rol} don't exists`);
  }
};

const emailExistsValidator = async (email = "") => {
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new Error("Email is already registered");
  }
};

const userExistsWithID = async (id) => {
  const userExists = await User.findById(id);

  if (!userExists) {
    throw new Error("User with that id don't exists");
  }
};

const validateCollection = async (collection = "", collections = []) => {
  const includes = collections.includes(collection);
  if (!includes) throw new Error(`The collection ${collection} is not allowed`);
};

module.exports = {
  roleValidator,
  emailExistsValidator,
  userExistsWithID,
  validateCollection,
};
