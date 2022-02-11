const { request, response } = require("express");
const path = require("path");
const fs = require("fs");
const { User, Product } = require("../models");
const { uploadFile } = require("../utils");

const upload = async (req = request, res = response) => {
  try {
    const name = await uploadFile(req.files, undefined, "products");
    res.status(200).json({ name });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateImg = async (req = request, res = response) => {
  const { collection, id } = req.params;
  let model;
  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `A user with the id ${id} don't exists`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `A product with the id ${id} don't exists`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "An extra validation is needed, I guess, you are not allowed to be here!",
      });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);

    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const name = await uploadFile(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.status(200).json(model);
};

module.exports = { upload, updateImg };
