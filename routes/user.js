const { Router } = require("express");
const { check } = require("express-validator");
const {
  usersGet,
  createUser,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/user");

const {
  roleValidator,
  emailExistsValidator,
  userExistsWithID,
} = require("../utils/db-validator");
const validationFields = require("../middlewares/validationFields");
const validateJWT = require("../middlewares/validationJWT");
const { isAdmin, haveRol } = require("../middlewares/validateUserRol");

const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  [
    check("email", "Email is not valid").isEmail(),
    check("email").custom(emailExistsValidator),
    check("name", "Name should not be empty").not().isEmpty(),
    check(
      "password",
      "Password should be more than 6 characters long"
    ).isLength({ min: 6 }),
    check("rol").custom(roleValidator),
  ],
  validationFields,
  createUser
);

router.put(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(userExistsWithID),
    check("rol").custom(roleValidator),
    validationFields,
  ],
  usersPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    haveRol("ADMIN_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(userExistsWithID),
  ],
  usersDelete
);
router.patch("/", usersPatch);
module.exports = router;
