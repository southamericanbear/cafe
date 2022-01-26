const req = require("express/lib/request");
const { Category } = require("../models");

const categoryValidatorWithID = async (id) => {
  const categoryExist = await Category.findById(id);

  if (!categoryExist) {
    throw new Error("Category with that id don't exists");
  }

  req.category = categoryExist;
};

const categoryNameExistsValidator = async (name = "") => {
  const searchParam = name.toUpperCase();
  const result = await Category.findOne({ name: searchParam });

  if (result) {
    throw new Error("Category already exists");
  }
};

module.exports = { categoryValidatorWithID, categoryNameExistsValidator };
