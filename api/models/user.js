const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);
const crypt = require("../helper/crypt");
const secret = process.ENV.SHA256_SECRET || 'secret';
const hash = crypt.createHmac('sha256', secret);

var Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    concerts: [{
        topImage: String,
        bottomImage: String,
        name: String,
        startTime: Date,
        endTime: Date,
        startDate: Date,
        spreadsheetLink: String
    }],
    tickets: [{
        concertId: ObjectId,
        seatClass: String,
        isUsed: Boolean
    }]
});

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true
});
userSchema.set('toObject', {
    virtuals: true
});

userSchema.methods.hashPassword = (password) => {
    return hash.update(password).digest('hex');
}

userSchema.methods.comparePassword = (plainPassword) => {
    const otherPassword = this.hashPasword(plainPassword);
    return otherPassword === this.password;
};

module.exports = mongoose.model("User", userSchema, "users");