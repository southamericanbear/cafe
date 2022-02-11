const dbValidator = require("./db-validator");
const generateJwt = require("./generate-jwt");
const googleVerify = require("./google-verify");
const uploadFile = require("./upload-file");
const validateCategory = require("./validate-category");
const validateProduct = require("./validate-product");

module.exports = {
  ...dbValidator,
  ...generateJwt,
  ...googleVerify,
  ...uploadFile,
  ...validateCategory,
  ...validateProduct,
};
