const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const validationFields = require("../middlewares/validationFields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validationFields,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id token is required").not().isEmpty(), validationFields],
  googleSignIn
);

module.exports = router;
