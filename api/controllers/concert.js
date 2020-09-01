const logger = require("../config/logger");
const {HTTP_STATUS} = require("../constants/httpStatus");
const Validator = require("../constants/validators");
const Concert = require("../services/concert");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

/**
 * Send email verify code
 */

exports.createConcert = async function (req, res) {
  try {
    const {value, error} = Validator.createConcertSchema.validate(req.body);
    if(error) throw error;

    const test = await Concert.createConcert(req.user._id, value)
    return response.writeJson(res, test, HTTP_STATUS.OK.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}