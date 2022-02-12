const { request, response } = require("express");
const path = require("path");
const fs = require("fs");
const { User, Product } = require("../models");
const { uploadFile } = require("../utils");
const cloudinary = require("cloudinary");
cloudinary.config(process.env.CLOUDINARY_URL);

const upload = async (req = request, res = response) => {
  try {
    const name = await uploadFile(req.files, undefined, "products");
    res.status(200).json({ name });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// const updateImg = async (req = request, res = response) => {
//   const { collection, id } = req.params;
//   let model;
//   switch (collection) {
//     case "users":
//       model = await User.findById(id);
//       if (!model) {
//         return res.status(400).json({
//           msg: `A user with the id ${id} don't exists`,
//         });
//       }
//       break;
//     case "products":
//       model = await Product.findById(id);
//       if (!model) {
//         return res.status(400).json({
//           msg: `A product with the id ${id} don't exists`,
//         });
//       }
//       break;
//     default:
//       return res.status(500).json({
//         msg: "An extra validation is needed, I guess, you are not allowed to be here!",
//       });
//   }

//   if (model.img) {
//     const pathImg = path.join(__dirname, "../uploads", collection, model.img);

//     if (fs.existsSync(pathImg)) {
//       fs.unlinkSync(pathImg);
//     }
//   }

//   const name = await uploadFile(req.files, undefined, collection);
//   model.img = name;

//   await model.save();

//   res.status(200).json(model);
// };

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
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.status(200).json(model);
};

const getImage = async (req = request, res = response) => {
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
      return res.sendFile(pathImg);
    }
  }
  const pathImgNotFound = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathImgNotFound);
};

module.exports = { upload, updateImg, getImage };
