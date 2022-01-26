const { Router } = require("express");
const { check } = require("express-validator");
const {
  getAllProducts,
  createproduct,
  getProductByID,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { isAdmin, haveRol } = require("../middlewares/validateUserRol");

const validationFields = require("../middlewares/validationFields");
const validateJWT = require("../middlewares/validationJWT");
const { productValidatorWithID } = require("../utils/validate-product");

const router = Router();

router.get("/", getAllProducts);

router.get(
  "/:id",
  [
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(productValidatorWithID),
    validationFields,
  ],
  getProductByID
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validationFields,
  ],
  createproduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(productValidatorWithID),
    validationFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    haveRol("ADMIN_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productValidatorWithID),
    validationFields,
  ],
  deleteProduct
);

module.exports = router;
