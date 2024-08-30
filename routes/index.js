const express = require("express");

const router = express.Router();

const register = require("./register");

const transactions = require("./transactions");
const Profile = require("./Profile");
const Comments = require("./Comments");
const Works = require("./Works");
const Heding = require("./Heding");
router.use("/registration", register);

router.use("/transactions", transactions);
router.use("/profile", Profile);
router.use("/comment", Comments);
router.use("/works", Works);
router.use("/heding", Heding);

module.exports = router;
