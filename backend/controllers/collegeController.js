const College = require("../models/College");

// CREATE COLLEGE (POST)
exports.createCollege = async (req, res) => {
    try {
        const newCollege = new College(req.body);

        const savedCollege = await newCollege.save();

        res.status(201).json({
            success: true,
            message: "College created successfully",
            data: savedCollege
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating college",
            error: error.message
        });
    }
};

// GET ALL COLLEGES
exports.getAllColleges = async (req, res) => {
  try {

    const colleges = await College.find();

    res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching colleges",
      error: error.message
    });
  }
};