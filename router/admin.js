const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/admin");


router.get("/covidInfoStaff/:id", adminController.getCovidInfoStaff);


module.exports = router;
