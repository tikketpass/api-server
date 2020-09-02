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