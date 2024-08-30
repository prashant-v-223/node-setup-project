const express = require("express");
const router = express.Router();
const validator = require("../validator/validator");
const registerController = require("../controllers/register");

router.post("/changePassword", (req, res) => {
  return registerController.register.resetPassword(req, res);
});
router.post("/forgotPassword", (req, res) => {
  return registerController.register.forgotPassword(req, res);
});
router.post("/login", (req, res) => {
  return registerController.register.login(req, res);
});
module.exports = router;
