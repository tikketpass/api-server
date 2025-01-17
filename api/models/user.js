const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);
const sha256 = require("sha256");

const Schema = mongoose.Schema;

const concertSchema = new Schema({
    topImageLink: String,
    bottomImageLink: String,
    name: {
        type: String,
        required: true
    },
    enterTime: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    spreadsheetId: {
        type: String
    }
});

concertSchema.virtual("spreadsheetLink").get(function() {
    return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit`;
});

const ticketSchema = new Schema({
    concertId: String,
    userName: String,
    userPhoneNumber: String,
    seatClass: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        required: true
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 64,
        max: 64,
        required: true
    },
    concerts: [concertSchema],
    tickets: [ticketSchema],
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
    return sha256(password);
}

userSchema.methods.comparePassword = (plainPassword) => {
    const otherPassword = this.hashPasword(plainPassword);
    return otherPassword === this.password;
};

module.exports = mongoose.model("User", userSchema, "users");