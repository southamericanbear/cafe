const { Router } = require("express");
const { check } = require("express-validator");
const { getAllProducts, createproduct } = require("../controllers/products");
const validationFields = require("../middlewares/validationFields");
const validateJWT = require("../middlewares/validationJWT");

const router = Router();

router.get("/", getAllProducts);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validationFields,
  ],
  createproduct
);

module.exports = router;
