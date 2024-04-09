var bcrypt = require("bcryptjs");
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
const transactionsmodal = require("../models/transactions");
const {
  token,
  tokenverify,
} = require("../middleware/token");
const { Mailgun } = require("mailgun");
exports.register = {
 
};
