const User = require("../models/user");

exports.createConcert = async function (userId, newConcertData) {
    try {
        let newConcert = newConcertData;
        newConcert.spreadsheetLink = "test";
        newConcert.topImage = null;
        newConcert.bottomImage = null;

        //TODO: create spreadsheet

        await User.updateOne({_id: userId}, {$push: {concerts: newConcertData}});
        const user = await User.findOne({_id: userId});
        const concert = user.concerts[user.concerts.length-1];

        return concert;
    } catch (err) {
        throw err;
    }
}