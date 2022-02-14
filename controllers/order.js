const { response, request } = require("express");
const { Product, User } = require("../models");
const Order = require("../models/Order");

const createOrder = async (req = request, res = response) => {
  const total = req.body.total;
  const userID = req.body.user;
  const IDs = req.body.products;
  const user = await User.findById(userID);
  const products = await Product.find({ _id: { $in: IDs } })
    .then(
      (product) => IDs.map((e) => product.find((s) => s._id.equals(e))) // compare
    )
    .then((product) => {
      return product;
    });

  const data = {
    total,
    user: userID,
    products,
  };

  const order = new Order(data);

  try {
    await order.save();
    res.status(200).json({
      msg: "Order successfully created",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createOrder };
