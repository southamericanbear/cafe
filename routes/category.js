const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { isAdmin, haveRol } = require("../middlewares/validateUserRol");
const validationFields = require("../middlewares/validationFields");
const validateJWT = require("../middlewares/validationJWT");
const {
  categoryValidatorWithID,
  categoryNameExistsValidator,
} = require("../utils/validate-category");

const router = Router();

router.get("/", getAllCategories);

router.get(
  "/:id",
  [
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(categoryValidatorWithID),
    validationFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "name is required").not().isEmpty(),
    validationFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(categoryValidatorWithID),
    check("name", "name is required").not().isEmpty(),
    check("name").custom(categoryNameExistsValidator),
    validationFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    haveRol("ADMIN_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryValidatorWithID),
    validationFields,
  ],
  deleteCategory
);

module.exports = router;
