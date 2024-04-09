const express = require("express");
const router = express.Router();
const registerController = require("../controllers/register");

router.post("/signUp", (req, res) => {
  return registerController.register.signUp(req, res);
});
router.post("/login", (req, res) => {
  return registerController.register.signIn(req, res);
});
module.exports = router;
