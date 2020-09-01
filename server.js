import config, { nodeEnv, logStars } from './config';
import mongoose from './database/config/connection';
import authRouter from "./api/routers/auth";
import passport from "passport";
import express from "express";

const server = express();
server.use('/v1/', authRouter);

// Start server
server.listen(config.port, () => {
    console.info('Quick server is started on', config.hostname +':'+ config.port);
});
