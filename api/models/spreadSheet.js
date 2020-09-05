const appRoot = require('app-root-path');
const mongoose = require(`${appRoot}/database/config/connection`);

const Schema = mongoose.Schema;
const spreadSheetSchema = new Schema({
    spreadsheetId: {
        type: String,
        unique: true,
        required: true
    },
    title: String,
    rows: [{
        name: String,
        contact: String,
        email: String,
        seat: String,
    }],
});

spreadSheetSchema.virtual('url').get(function() {
    return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit`;
});

module.exports = mongoose.model("SpreadSheet", spreadSheetSchema, "spread_sheets");
