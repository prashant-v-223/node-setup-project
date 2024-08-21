const express = require("express");

const router = express.Router();

const register = require("./register");

const transactions = require("./transactions");
const Profile = require("./Profile");
const Comments = require("./Comments");
const Works = require("./Works");
router.use("/registration", register);

router.use("/transactions", transactions);
router.use("/profile", Profile);
router.use("/comment", Comments);
router.use("/works", Works);

module.exports = router;
