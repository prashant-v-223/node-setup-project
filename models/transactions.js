"use strict";
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Transactions = new mongoose.Schema(
  {
    userId: { type: String, trim: true },
    WalletType: { type: String, trim: true },
    leval: { type: Number, trim: true },
    amount: { type: Number, trim: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Transactions", Transactions);
