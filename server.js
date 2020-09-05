import config, { nodeEnv, logStars } from './config';
import mongoose from './database/config/connection';
import authRouter from "./api/routers/auth";
import concertRouter from "./api/routers/concert";
import ticketRouter from "./api/routers/ticket";
import sheetRouter from "./api/routers/sheet";
import logger from "./api/config/logger";
import passport from "passport";
import express from "express";

const server = express();
server.use(function (req, res, next) {
    if (process.env.LOGGER === 'true') {
        logger.info(" " + req.method + " " + req.originalUrl);
        // logger.info("received from " + req.get("X-Forwarded-For")+" : "+req.method+" "+req.originalUrl+" (Authorization: "+req.get("Authorization")+") " + "content :"+ JSON.stringify(req.body));
    }
    next();
});
server.use('/v1/', authRouter);
server.use('/v1/', concertRouter);
server.use('/v1/', ticketRouter);
server.use('/v1/', sheetRouter);

// Start server
server.listen(config.port, () => {
    console.info('Quick server is started on', config.hostname +':'+ config.port);
});
