const { Router } = require("express");
const { search } = require("../controllers/search");

const router = Router();

// in the future there will be another route for search
// one with more restrictions for example:
// if we search a user only shows the ones that have an state in true
router.get("/:collection/:term", search);

module.exports = router;
