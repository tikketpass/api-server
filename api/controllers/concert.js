const logger = require("../config/logger");
const {HTTP_STATUS} = require("../constants/httpStatus");
const Validator = require("../constants/validators");
const Concert = require("../services/concert");

let {error, success} = require("../constants/response");
let response = require("../common/responseWriter");

/**
 * create new concert
 */
exports.createConcert = async function (req, res) {
  try {
    const {value, error} = Validator.createConcertSchema.validate(req.body);
    if(error) throw error;

    const concert = await Concert.createConcert(req.user._id, value)
    return response.writeJson(res, { concert }, HTTP_STATUS.CREATED.CODE)
  } catch (err) {
    logger.log("error", `Error occured, ${err}`);
    error.message = err.message || err._message;
    return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
  }
}

exports.updateConcert = async function (req, res) {
    try {
        const concertId = req.params.concertId;

        const topImageLink = req.files.topImage[0].location;
        const bottomImageLink = req.files.bottomImage[0].location;
        const { value, error } = Validator.updateConcertSchema.validate(req.body);

        const concert = await Concert.updateConcert(concertId, value, topImageLink, bottomImageLink);

        return response.writeJson(res, { concert }, HTTP_STATUS.OK.CODE);
    } catch (err) {
        logger.log("error", `Error occured, ${err}`);
        error.message = err.message || err._message;
        return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
    }
}

exports.getConcert = async function (req, res) {
    try {
        const concertId = req.params.concertId;

        const concert = await Concert.getConcert(concertId);

        return response.writeJson(res, {
            id: concert._id,
            name: concert.name,
            startTime: concert.startTime,
            endTime: concert.endTime,
            startDate: concert.startDate,
            spreadsheetLink: concert.spreadsheetLink,
            topImageLink: concert.topImageLink,
            bottomImageLink: concert.bottomImageLink
        }, HTTP_STATUS.OK.CODE);
    } catch (err) {
        logger.log("error", `Error occured, ${err}`);
        error.message = err.message || err._message;
        return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
    }
}

exports.getMyConcerts = async function (req, res) {
    try {
        const userId = req.params.userId;
        const option = {
            offset: parseInt(req.query.offset),
            limit: parseInt(req.query.limit)
        };

        const concerts = await Concert.getMyConcerts(userId, option);
        if(req.user._id != userId) throw new HTTPError(403, "jwt user id and url param user id does not match");

        return response.writeJson(res, {
            concerts: concerts.map(concert => {
                return {
                    id: concert._id,
                    name: concert.name,
                    startTime: concert.startTime,
                    endTime: concert.endTime,
                    startDate: concert.startDate,
                    spreadsheetLink: concert.spreadsheetLink,
                    topImageLink: concert.topImageLink,
                    bottomImageLink: concert.bottomImageLink
                }
            })
        });
    } catch (err) {
        logger.log("error", `Error occured, ${err}`);
        error.message = err.message || err._message;
        return response.writeJson(res, { message: err.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE)
    }
}