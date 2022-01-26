const { Router } = require("express");
const { check } = require("express-validator");
const { getAllProducts } = require("../controllers/products");

const router = Router();

router.get("/", getAllProducts);

module.exports = router;
