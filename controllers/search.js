const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models/index");

const allowedCollections = ["users", "categories", "products", "rol"];

const searchUsers = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await User.findById(term);
    return res.status(200).json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  res.status(200).json({
    results: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const category = await Category.findById(term).populate("products", "name");
    return res.status(200).json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const category = await Category.find({
    name: regex,
    state: true,
  }).populate("products", "name");

  res.status(200).json({
    results: category,
  });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const product = await Product.findById(term).populate("category", "name");
    return res.status(200).json({
      results: product ? [product] : [],
    });
  }

  const regexStr = new RegExp(term, "i");

  const product = await Product.find({
    $or: [{ name: regexStr }],
    $and: [{ state: true }],
  }).populate("category", "name");

  res.status(200).json({
    results: product,
  });
};

const search = async (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Invalid collection, search is only allowed in this collections: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: "An error in the server occurred check the console",
      });
  }
};

module.exports = { search };
