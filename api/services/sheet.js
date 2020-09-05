const SpreadSheet = require("../models/spreadSheet");
const HTTPError = require("node-http-error");
const excel = require("sheet");

exports.create = excel.create;

exports.read = excel.read;

exports.urlFormatter = excel.urlFormatter;

exports.sync = async (spreadsheetId) => {
    /**
     * spreadsheetId: String
     * 클라이언트에서 변경사항 저장하기 눌렀을때 호출된다.
     * 스프레드시트 정보를 서버 디비에 동기화시킨다.
     */

    SpreadSheet.findOne({"spreadsheetId": spreadsheetId}).then(doc => {
        excel.read(spreadsheetId, "시트1!A:D").then((rows) => {
            doc.rows = rows.map((row) => {
                row_obj = {
                    name: row[0],
                    contact: row[1],
                    email: row[2],
                    seat: row[3],
                };
            });
            doc.save();
        });
    }).catch(err => {
        throw new HTTPError(403, `cannot find matching spreadsheetId: {spreadsheetId}, err: ${err}`);
    });
}

exports.checkList = async (row) => {
    /**
     * row.name: String,
     * row.contact: String,
     * row.email: String,
     * row.seat: String,
     */
    const { name, contact, email, seat } = row;

    const query_res = SpreadSheet.findOne({
        "rows.$.name": name, "rows.$.contact": contact, "rows.$.email": email, "rows.$.seat": seat,
    });

    if (!query_res)
        return false;
    return true;
}
