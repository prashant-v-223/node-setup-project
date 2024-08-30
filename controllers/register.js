const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Usermodal = require("../models/user");
const { decodeUris } = require("../library/commonQueries");
const { successResponse, badRequestResponse, errorResponse } = require("../middleware/response");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any email service provider you use
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Store OTPs temporarily (in-memory, consider using a more persistent solution)
const otpStore = new Map();

exports.register = {

  login: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const { email, password } = req.body;

      const userdata = await Usermodal.findOne({ email });

      if (!userdata) {
        return badRequestResponse(res, { message: "User not found!" });
      }

      const isMatch = await bcrypt.compare(password, userdata.password);

      if (!isMatch) {
        return badRequestResponse(res, { message: "Invalid credentials!" });
      }

      return successResponse(res, { message: "Login successful!" });

    } catch (error) {
      console.error("Error during login:", error);
      return errorResponse(error, res);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const { email } = req.body;

      const user = await Usermodal.findOne({ email });

      if (!user) {
        return badRequestResponse(res, { message: "User not found!" });
      }

      // Generate OTP
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
      otpStore.set(email, otp);

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for resetting your password is ${otp}.`
      };

      await transporter.sendMail(mailOptions);

      return successResponse(res, { message: "OTP sent to your email!" });

    } catch (error) {
      console.error("Error during forgot password request:", error);
      return errorResponse(error, res);
    }
  },

  resetPassword: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const { email, otp, newPassword } = req.body;

      const storedOtp = otpStore.get(email);

      if (!storedOtp || storedOtp !== otp) {
        return badRequestResponse(res, { message: "Invalid or expired OTP!" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await Usermodal.updateOne({ email }, { password: hashedPassword });

      // Clear OTP from store
      otpStore.delete(email);

      return successResponse(res, { message: "Password reset successfully!" });

    } catch (error) {
      console.error("Error during password reset:", error);
      return errorResponse(error, res);
    }
  }
};
