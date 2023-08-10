const express = require("express");
const router = express.Router();
const validator = require("../validator/validator");
const registerController = require("../controllers/register");

router.post("/signUp", validator.signUp, (req, res) => {
  return registerController.register.signUp(req, res);
});

module.exports = router;
