const express = require("express");
const router = express.Router();
const validator = require("../validator/validator");
const registerController = require("../controllers/register");

router.post("/signUp", (req, res) => {
  return registerController.register.signUp(req, res);
});
router.post("/login", (req, res) => {
  return registerController.register.signIn(req, res);
});
router.post("/subscribe", (req, res) => {
  return registerController.register.subscribe(req, res);
});
router.get("/subscriberewords", (req, res) => {
  return registerController.register.subscriberewords(req, res);
});
router.get("/referralrewords", (req, res) => {
  return registerController.register.referralrewords(req, res);
});
module.exports = router;
