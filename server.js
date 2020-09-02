import config, { nodeEnv, logStars } from './config';
import mongoose from './database/config/connection';
import authRouter from "./api/routers/auth";
import concertRouter from "./api/routers/concert";
import ticketRouter from "./api/routers/ticket";
import passport from "passport";
import express from "express";

const server = express();
server.use('/v1/', authRouter);
server.use('/v1/', concertRouter);
server.use('/v1/', ticketRouter);

// Start server
server.listen(config.port, () => {
    console.info('Quick server is started on', config.hostname +':'+ config.port);
});
