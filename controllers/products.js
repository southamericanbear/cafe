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

const getProductByID = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate(populate);

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "An error occurred please check the console",
    });
  }
};

const createProduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryID = req.body.category;
  const category = await Category.findById(categoryID);

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
    await Category.findByIdAndUpdate(categoryID, {
      products: [...category.products, product],
    });
    await product.save();

    res.status(200).json({
      msg: "product created",
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const productName = req.product.name;

  const { name = productName, price = 0 } = req.body;
  const product = await Product.findOne({ name: name.toUpperCase() });
  if (product) {
    return res.status(400).json({
      msg: `There is already a product created with the name ${product.name}`,
    });
  }

  try {
    await Product.findByIdAndUpdate(id, {
      name: name.toUpperCase(),
      price: price,
    });
    res.status(200).json({
      msg: `Product ${name} is updated`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "An error occurred, check the console",
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, { state: false });
    res.status(200).json({
      msg: "Product successfully deleted",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "An error occurred, check the console",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
};
