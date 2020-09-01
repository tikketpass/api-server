const logger = require("../config/logger");
const {HTTP_STATUS} = require("../constants/httpStatus");
const Validator = require("../constants/validators");
const Auth = require("../services/auth");
const jwt = require("jsonwebtoken");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

/**
 * Send email verify code
 */

exports.sendEmailCode = async function (req, res) {
  try {
    const {value, error} = Validator.sendEmailCodeSchema.validate(req.body);
    if(error) throw error;

    const option = {
      to: value.email
    }

    await Auth.sendEmailCode(option)
    return response.writeJson(res, null, HTTP_STATUS.OK.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}

exports.signUp = async function (req, res) {
  try {
    const {value, error} = Validator.signUpSchema.validate(req.body);
    if(error) throw error;

    const user = await Auth.signUp(value);
    const accessToken = jwt.sign({ sub: user._id, role: "PARTICIPANT" }, process.env.JWT_SECRET, { expiresIn: "30d" });

    return response.writeJson(res, {
      accessToken,
      tokenType: "Bearer",
      user: {
        id: user._id,
        email: user.email
      }
    }, HTTP_STATUS.OK.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}


exports.signIn = async function (req, res) {
  try {
    const {value, error} = Validator.signInSchema.validate(req.body);
    if(error) throw error;

    const { role, ..._signInData } = value;
    const user = await Auth.signIn(_signInData);
    const accessToken = jwt.sign({ sub: user._id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    return response.writeJson(res, {
      accessToken,
      tokenType: "Bearer",
      user: {
        id: user._id,
        email: user.email
      }
    }, HTTP_STATUS.OK.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}