const logger = require("../config/logger");
const {HTTP_STATUS} = require("../constants/httpStatus");
const Validator = require("../constants/validators");
const Ticket = require("../services/ticket");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

/**
 * get my tickets
 */
exports.getMyTickets = async function (req, res) {
  try {
    const userId = req.params.userId;
    const option = {
        expiredSize: parseInt(req.query.expiredSize),
        unexpiredSize: parseInt(req.query.unexpiredSize)
    };


    const tickets = await Ticket.getMyTickets(userId, option)
    if(req.user._id != userId) throw new HTTPError(403, "jwt user id and url param user id does not match");

    return response.writeJson(res, tickets, HTTP_STATUS.OK.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}