"use strict";
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = new mongoose.Schema(
  {
    firstname: { type: String, },
    lastname: { type: String, },
    email: { type: String, trim: true },
    refferalId: { type: String },
    refferalBY: { type: String },
    password: { type: String },
    mobile: { type: Number },
    is_verify: { type: String, trim: true },
    otp: { type: Number, unique: true },
    active: { type: Boolean, default: true },
    subscribe: { type: Boolean, default: false },
    Role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);
user.pre("save", async function (next) {
  this.isModified("password") &&
    (this.password = await bcrypt.hash(this.password, 10));
  next();
});
module.exports = mongoose.model("user", user);
