const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);

const Schema = mongoose.Schema;
const verifyEmailSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    isVerified: Boolean,
    code: String,
    codeSentAt: Date
});

module.exports = mongoose.model("VerifyEmail", verifyEmailSchema, "verify_emails");