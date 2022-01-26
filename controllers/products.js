const { response, request } = require("express");
const { Product, Category } = require("../models");

const populate = {
  path: "category",
  select: "name",
  Category,
};

const getAllProducts = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;

  const query = { state: true };

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate(populate),
    ]);

    res.status(200).json({
      total,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error occurred, please check the logs",
    });
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
