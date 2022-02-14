const { Router } = require("express");
const { check } = require("express-validator");
const { updateImg } = require("../controllers/uploads");
const checkFile = require("../middlewares/check-file");
const validationFields = require("../middlewares/validationFields");
const validateJWT = require("../middlewares/validationJWT");
const { validateCollection } = require("../utils");

const router = Router();

router.put(
  "/:collection/:id",
  [
    validateJWT,
    checkFile,
    check("id", "ID is not valid").isMongoId(),
    check("collection").custom((c) =>
      validateCollection(c, ["users", "products"])
    ),
    validationFields,
  ],
  updateImg
);

module.exports = router;
