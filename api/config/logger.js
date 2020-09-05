const dotenv = require('dotenv');
dotenv.config();
const winston = require('winston');
const fs = require('fs');
const logDir = process.env.LOG_DIR;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const options = {
    file: {
        level: 'info',
        filename: `${logDir}/info.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.colorize(),  // 색깔 넣어서 출력
        winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    ),
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
