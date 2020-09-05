const logger = require("../config/logger");
const {HTTP_STATUS} = require("../constants/httpStatus");
const Validator = require("../constants/validators");
const Sheet = require("../services/sheet");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

exports.sync = async function (req, res) {
  try {
    const { spreadsheetId } = req.params;
    if (!spreadsheetId) throw new HTTPError("403", `Invalid parameter spreadsheetId: ${req.params.spreadsheetId}`);

    Sheet.sync(spreadsheetId);
    
    return response.writeJson(res, { status: 'OK' });
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE);
  }
}
