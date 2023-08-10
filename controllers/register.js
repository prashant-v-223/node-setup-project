var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var ejs = require("ejs");
const jwt = require("jsonwebtoken");
const {
  decodeUris,
  cloneDeep,
  findOneRecord,
  updateRecord,
  hardDeleteRecord,
} = require("../library/commonQueries");
const {
  successResponse,
  badRequestResponse,
  errorResponse,
  notFoundResponse,
} = require("../middleware/response");
const Usermodal = require("../models/user");
const adminmodal = require("../models/admin");
const Token = require("../models/Token");
const {
  token,
  tokenverify,
  Forgetpasswordtoken,
} = require("../middleware/token");
const { Mailgun } = require("mailgun");
let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.register = {
  signUp: async (req, res) => {
    try {
      const userdata = await findOneRecord(Usermodal, {
        email: req.body.email,
      });
      if (userdata !== null) {
        return badRequestResponse(res, {
          message: "user is already exist.",
        });
      } else {
        await new Usermodal({
          ...req.body
        }).save();
        return successResponse(res, {
          message:
            "Ragitrarion successfully",
        });
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
};
