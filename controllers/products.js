const { response, request } = require("express");
const { Product, Category } = require("../models");

const getAllProducts = async (req = request, res = response) => {
  try {
    res.status(200).json({
      msg: "products go here",
    });
  } catch (error) {
    console.log(error);
  }
};

const createproduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryID = req.body.category;
  const category = await Category.findById(categoryID);
  console.log(category);
  const productDB = await Product.findOne({ name });

  if (productDB && productDB.state) {
    return res.status(400).json({
      msg: `Product ${productDB.name} already exists`,
    });
  }

  if (productDB && !productDB.state) {
    const { name, _id } = productDB;
    try {
      await Product.findByIdAndUpdate(_id, { state: true });
      return res.status(200).json({
        msg: `Product ${name} is active again`,
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
    category: category._id,
  };

  const product = new Product(data);

  try {
    await product.save();

    res.status(200).json({
      msg: "product created",
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  createproduct,
};
