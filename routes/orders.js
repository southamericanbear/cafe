const { Router } = require("express");
const { createOrder } = require("../controllers/order");
const validateJWT = require("../middlewares/validationJWT");

const router = Router();

router.post("/", validateJWT, createOrder);

module.exports = router;
