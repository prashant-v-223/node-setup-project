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
const Usermodal = require("../models/user");
const {
  token,
  tokenverify,
} = require("../middleware/token");
const { Mailgun } = require("mailgun");
const { subscribe } = require("../routes");
const transactions = require("../models/transactions");

const CCBupdate = async ({ data, decoded, req }) => {
  const supporterIds = [];
  console.log("datadatadata", data);
  let supporterId = data.refferalBY;
  let dat12 = [8, 4, 3, 2, 2, 2, 1, 1, 1, 1]
  // Populate supporterIds array with supporterId for each level
  for (let i = 1; i <= 10; i++) {
    const Refflevalncome = await findOneRecord(Usermodal, {
      refferalId: supporterId,
    });

    if (!Refflevalncome) break;

    supporterIds.push(Refflevalncome._id);
    supporterId = Refflevalncome.supporterId;
  }

  for (let i = 1; i <= supporterIds.length; i++) {
    if ((req.body.Amount * (dat12[i])) / 100 != null) {
      const Refflevalncome = await findOneRecord(Usermodal, {
        _id: supporterIds[i - 1],
      });
      console.log({ "data": Refflevalncome, "amount": (req.body.Amount * (dat12[i])) / 100, "leval": i, "%": dat12[i] });
      await transactions({
        userId: Refflevalncome._id,
        WalletType: `Level ${i} plan (${decoded.profile.firstname})`,
        amount: (100 * (dat12[i - 1])) / 100,
        leval: i,
      }).save();
    }
  }
};

exports.register = {
  signUp: async (req, res) => {
    try {
      let uniqueRefid = await Date.now().toString(16).slice(2);
      req.body.refferalId = uniqueRefid;
      req.body = decodeUris(req.body);
      const userdata = await findOneRecord(Usermodal, {
        email: req.body.email,
      });
      console.log(userdata);
      if (userdata !== null) {
        return badRequestResponse(res, {
          message: "user is already exist.",
        });
      } else {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 5; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        const isCreated = await Usermodal({
          ...req.body,
          otp: Number(OTP),
          subscribe: false
        }).save()
        console.log("isCreated", isCreated);
        if (!isCreated) {
          return badRequestResponse(res, {
            message: "Failed to create register!",
          });
        } else {
          const profile = await Usermodal.findById(isCreated._id).select({
            password: 0,
          });
          return successResponse(res, {
            message: "registration successfully",
          });
        }
      }
    } catch (error) {
      console.log("error");
      return errorResponse(error, res);
    }
  },
  signIn: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const user = await findOneRecord(Usermodal, { email: req.body.email });
      if (!user) {
        notFoundResponse(res, { message: "User Not Found!" });
      } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (
          !match &&
          user.password.toString() !== req.body.password.toString()
        ) {
          badRequestResponse(res, { message: "Password is incorrect!" });
        } else {
          const accessToken = await token(Usermodal, user);
          return successResponse(res, {
            message: "Login successfully",
            token: accessToken.token,
            profile: user,
          });
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  subscribe: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          req.body = decodeUris(req.body);
          if (decoded.profile.refferalId !== req.body.referral) {
            console.log("decoded", req.body.referral);
            const user = await findOneRecord(Usermodal, { refferalId: req.body.referral });
            if (!user) {
              notFoundResponse(res, { message: "User Not Found!" });
            } else {
              await updateRecord(Usermodal, { refferalId: decoded.profile.refferalId }, {
                refferalBY: req.body.referral,
                subscribe: true,
              })
              const data = await findOneRecord(Usermodal, { refferalId: decoded.profile.refferalId });
              console.log("data", data);
              await CCBupdate({ data, decoded, req })
              return successResponse(res, {
                message: "done",
              });
            }
          } else {
            notFoundResponse(res, { message: "User Not Found!" });
          }
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  referralrewords: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          req.body = decodeUris(req.body);
          // const data = await transactions.find({ userId: decoded.profile._id.toString() })
          const data = await Usermodal.find({ refferalBY: decoded.profile.refferalId })
          return successResponse(res, {
            message: "password change successfully",
            data: data
          });
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  subscriberewords: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          req.body = decodeUris(req.body);
          // const data = await transactions.find({ userId: decoded.profile._id.toString() })
          const data = await transactions.find({})
          return successResponse(res, {
            message: "password change successfully",
            data: data
          });
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const user = await findOneRecord(Usermodal, { email: req.body.email });
      if (!user) {
        notFoundResponse(res, { message: "User Not Found!" });
      } else {
        decoded = await cloneDeep(user);
        const accessToken = await Forgetpasswordtoken(Usermodal, decoded);
        let token = await Token.findOne({ userId: decoded._id });
        if (!token) {
          token = await new Token({
            userId: decoded._id,
            token: accessToken.token,
          }).save();
        } else {
          await updateRecord(
            Token,
            {
              userId: decoded._id,
            },
            {
              token: accessToken.token,
            }
          );
        }
        ejs.renderFile(
          __dirname + "/Forgetpassword.ejs",
          {
            from: "donotreply@v4x.org",
            action_url: accessToken.token,
          },
          async function (err, data) {
            const DOMAIN = "donotreply.v4x.org";
            const mg = Mailgun({
              apiKey: "afd2a109fddce998ef411c7ac33c3e0c-81bd92f8-5473abd7",
              domain: DOMAIN,
            });
            const data111 = {
              from: "donotreply@v4x.org",
              to: decoded["email"],
              subject: "main varification",
              html: data,
            };
            mg.messages().send(data111, function (error, body) {
              console.log("body", body);
              console.log(error);
              if (!error) {
                return successResponse(res, {
                  message:
                    "Forgot Password link has been send to your email address..!!",
                });
              } else {
                return badRequestResponse(res, {
                  message: `Email not send error something is wrong ${err}`,
                });
              }
            });
          }
        );
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  changePassword: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization.split(" ")[1]
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          let token = await Token.findOne({ userId: decoded.profile._id });
          if (!token) {
            return badRequestResponse(res, {
              message: "token is expires.",
            });
          }
          const { password } = req.body;
          decoded = await cloneDeep(decoded);
          await hardDeleteRecord(Token, {
            userId: decoded.profile._id,
          });
          await bcrypt.hash(password, 8).then((pass) => {
            updateRecord(
              Usermodal,
              { _id: decoded.profile._id },
              {
                password: pass,
              }
            );
            hardDeleteRecord(Token, { _id: decoded.profile._id });
            return successResponse(res, {
              message: "password change successfully",
            });
          });
        }
      } else {
        badRequestResponse(res, {
          message: "No token provided.",
        });
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
};
