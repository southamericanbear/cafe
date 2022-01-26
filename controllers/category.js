const { response, request } = require("express");
const { Category, User } = require("../models");

const populate = {
  path: "user",
  select: ["name", "email", "img", "rol"],
  User,
};

const getAllCategories = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;

  const query = { state: true };

  try {
    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate(populate),
    ]);

    res.status(200).json({
      total,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error occurred, please check the logs",
    });
  }
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate(populate);
    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "An error occurred please check the console",
    });
  }
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await Category.findByIdAndUpdate(id, { name: name.toUpperCase() });
    res.status(200).json({
      msg: "Category updated",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "An error occurred, check the console",
    });
  }
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB && categoryDB.state) {
    return res.status(400).json({
      msg: `Category ${categoryDB.name} already exists`,
    });
  }

  if (categoryDB && !categoryDB.state) {
    const { name, _id } = categoryDB;

    try {
      await Category.findByIdAndUpdate(_id, { state: true });
      return res.status(200).json({
        msg: `Category ${name} is active again`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: "An error occurred, check the console",
      });
    }
  }

  const data = {
    name,
    user: req.authenticatedUser._id,
  };

  const category = new Category(data);

  try {
    await category.save();
    res.status(200).json({
      msg: "category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "An error occurred. please check the logs",
    });
  }
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, { state: false });

    res.status(200).json({
      msg: "Category successfully deleted",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "An error occurred, check the console",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
