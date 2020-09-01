const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);
const crypt = require("crypto");
const secret = process.env.SHA256_SECRET || 'secret';
const hash = crypt.createHmac('sha256', secret);

const Schema = mongoose.Schema;
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
    concerts: [{
        topImage: String,
        bottomImage: String,
        name: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        spreadsheetLink: {
            type: String
        }
    }],
    tickets: [{
        concertId: String,
        seatClass: {
            type: String,
            required: true
        },
        isUsed: {
            type: Boolean,
            required: true
        }
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