const { response, request } = require("express");
const { Product } = require("../models");

const getAllProducts = async (req = request, res = response) => {
  try {
    res.status(200).json({
      msg: "products go here",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
};
