import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import { connect } from './db';
import userRouter from './routes/user';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import activityRouter from './routes/activity';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow a specific origin when using credentials (cookies). Using '*' breaks Access-Control-Allow-Credentials.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
console.log('CORS allowed origin:', CLIENT_ORIGIN);
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use('/user', userRouter);
app.use('/activity', activityRouter);

// Read PORT/HOST (these are defined in .env as PORT and HOST). Provide sensible defaults.
const SERVER_PORT = Number(process.env.PORT) || 8000;
const SERVER_HOST = process.env.HOST || 'localhost';

connect()
  .then(() => {
    app.listen(SERVER_PORT, SERVER_HOST, (error?: Error) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log(`server ready at http://${SERVER_HOST}:${SERVER_PORT}/`);
      }
    });
  })
  .catch((err) => {
    // If DB connect failed and was propagated, log and exit so process manager can handle restarts.
    console.error('Failed to connect to database, server will not start:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
