const User = require("../models/user");
const HTTPError = require("node-http-error");

exports.createConcert = async function (userId, newConcertData) {
    try {
        let newConcert = newConcertData;
        newConcert.spreadsheetLink = "test";
        newConcert.topImageLink = null;
        newConcert.bottomImageLink = null;

        //TODO: create spreadsheet

        await User.updateOne({_id: userId}, {$push: {concerts: newConcertData}});
        const user = await User.findOne({_id: userId});
        const concert = user.concerts[user.concerts.length-1];

        return concert;
    } catch (err) {
        throw err;
    }
}

exports.getConcert = async function (concertId) {
    try {
        const user = await User.findOne({"concerts._id": concertId});
        if(user === null) throw new HTTPError(404, "concert not found");

        const concert = user.concerts.filter(concert => concert._id == concertId);

        return concert[0];
    } catch (err) {
        throw err;
    }
}

/**
 *
 * @param userId
 * @param option
 * @param option.limit -> optional
 * @param option.offset -> optional
 * @returns {Promise<void>}
 */
exports.getMyConcerts = async function (userId, option) {
    try {
        const user = await User.findOne({_id: userId});
        if (user === null) throw new HTTPError(404, "user not found");

        const concerts = user.concerts;
        const offset = option.offset || 0;
        const limit = option.limit;

        if(limit !== undefined) return concerts.slice(offset, offset+limit);
        else return concerts.slice(offset);
    } catch (err) {
        throw err;
    }
};