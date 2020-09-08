const User = require("../models/user");
const Spreadsheet = require("../models/spreadSheet");
const HTTPError = require("node-http-error");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({ apiVersion: "latest" });
const sheet = require("./sheet");

exports.createConcert = async function (userId, newConcertData) {
    try {
        let newConcert = newConcertData;
        newConcert.spreadsheetId = await sheet.create(newConcert.name, "시트1!A:D", [["이름", "연락처", "이메일", "좌석"]]);
        newConcert.topImageLink = null;
        newConcert.bottomImageLink = null;

        Spreadsheet.create({
            spreadsheetId: newConcert.spreadsheetId, 
            title: newConcert.name,
            rows: [],
        });

        await User.updateOne({_id: userId}, {$push: {concerts: newConcertData}});
        const user = await User.findOne({_id: userId});
        const concert = user.concerts[user.concerts.length-1];

        return concert;
    } catch (err) {
        throw err;
    }
}

exports.updateConcert = async function (concertId, concertData, topImageLink, bottomImageLink) {
    try {
        await User.updateOne({ "concerts._id": concertId }, { $set: {
                "concerts.$.name": concertData.name,
                "concerts.$.startTime": concertData.startTime,
                "concerts.$.enterTime": concertData.enterTime,
                "concerts.$.place": concertData.place,
                "concerts.$.topImageLink": topImageLink,
                "concerts.$.bottomImageLink": bottomImageLink,
            }
        });
        const user = await User.findOne({ "concerts._id": concertId });
        const concert = user.concerts.find(concert => concert._id == concertId);

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

        if(!isNaN(limit)) return concerts.slice(offset, offset+limit);
        else return concerts.slice(offset);
    } catch (err) {
        throw err;
    }
};

exports.upload = multer({
    storage: multerS3({
        s3,
        // TODO: 환경변수로 빼기
        bucket: "ground-backend",
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldname: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});