const appRoot = require('app-root-path');

const SpreadSheet = require("../models/spreadSheet");
const HTTPError = require("node-http-error");
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${appRoot}/api/services/sheets.googleapis.com-nodejs-write.json`;

/**
 *
 * @param {String} title
 */
const create = async (title) => {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(`${appRoot}/api/services/credentials.json`).then((content) => {
      authorize(JSON.parse(content))
        .then((auth) => { return createDocument(auth, title); })
        .then(resolve)
        .catch(getNewToken)
        .catch(console.log);
    }).catch((err) => {
      return console.log('Error loading client secret file:', err);
    });
  });
};

const read = async (spreadsheetId, range) => {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(`${appRoot}/api/services/credentials.json`).then((content) => {
      authorize(JSON.parse(content))
        .then((auth) => { return readDocument(auth, spreadsheetId, range); })
        .then(resolve)
        .catch(getNewToken)
        .catch(console.log);
    }).catch((err) => {
      return console.log('Error loading client secret file:', err);
    });
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.promises.readFile(TOKEN_PATH).then((token) => {
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    }).catch((err) => {
      reject(oAuth2Client);
    })
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client) {
  console.log(oAuth2Client);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) { reject(err); return; }
          console.log('Token stored to', TOKEN_PATH);
        });
        resolve(oAuth2Client);
      });
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function readDocument(auth, spreadsheetId, range) {
  const sheets = google.sheets({ version: 'v4', auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }, (err, res) => {
      if (err) return reject(err);
      const rows = res.data.values;
      return resolve(rows);
    });
  });
}

/**
 *
 * @param {google.auth.OAuth2} auth
 */
async function createDocument(auth, title) {
  const resource = {
    properties: {
      title: title,
    },
  };
  const sheets = google.sheets({ version: 'v4', auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    }, (err, spreadSheet) => {
      if (err) {
        reject(auth);
      } else {
        createPermission(auth, spreadSheet.data.spreadsheetId);
        return resolve(`${spreadSheet.data.spreadsheetId}`);
      }
    })
  });
}

async function createPermission(auth, fileId) {
  const drive = google.drive({
    version: 'v3',
    auth: auth
  });

  return new Promise((resolve, reject) => {
    drive.permissions.create({
      resource: {
        'type': 'anyone',
        'role': 'writer',
      },
      fileId: fileId,
      permissionId: "anyoneWithLink",
      fields: 'id',
    }, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.data.id); // supposed to be anyoneWithLink
      }
    });
  });
}

exports.create = create;

exports.read = read;

exports.urlFormatter = (spreadsheetId) => `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

exports.sync = async (spreadsheetId) => {
    /**
     * spreadsheetId: String
     * 클라이언트에서 변경사항 저장하기 눌렀을때 호출된다.
     * 스프레드시트 정보를 서버 디비에 동기화시킨다.
     */

    return SpreadSheet.findOne({"spreadsheetId": spreadsheetId}).then(sheet => {
      read(spreadsheetId, "시트1!A:D").then((rows) => {
        sheet.rows = rows.map((row) => {
          return {
            name: row[0],
            contact: row[1],
            email: row[2],
            seat: row[3],
          };
        });
        sheet.save();
        console.log(sheet.rows);
      });
      return sheet;
    }).catch(err => {
      throw new HTTPError(403, `cannot find matching spreadsheetId: ${spreadsheetId}, err: ${err}`);
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
