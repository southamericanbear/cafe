const { request, response } = require("express");
//const path = require("path");
//const fs = require("fs");
const { User, Product } = require("../models");
const cloudinaryUpload = require("../utils/cloudinary-upload");
const cloudinary = require("cloudinary");
//const { uploadFile } = require("../utils");

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

  if (model.img && !model.img.split(".").includes("dicebear")) {
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  model.img = await cloudinaryUpload(req.files.file);

  await model.save();

  res.status(200).json(model);
};

module.exports = { updateImg };
