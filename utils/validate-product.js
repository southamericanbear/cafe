const req = require("express/lib/request");
const { Product } = require("../models");

const productValidatorWithID = async (id) => {
  const productExist = await Product.findById(id);

  if (!productExist) {
    throw new Error("Category with that id don't exists");
  }

  req.product = productExist;
};

const productNameExistsValidator = async (name = "") => {
  const searchParam = name.toUpperCase();
  const result = await Product.findOne({ name: searchParam });

  if (result) {
    throw new Error("Product already exists");
  }
};

module.exports = { productValidatorWithID, productNameExistsValidator };
