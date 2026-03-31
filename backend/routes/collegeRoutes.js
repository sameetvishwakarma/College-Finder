const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");

// POST Route
router.post("/create", collegeController.createCollege);

// GET ALL
router.get("/allcolleges", collegeController.getAllColleges);

module.exports = router;