import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

/* we use this so that a client can use 16kb data at a time when data coe from form*/
app.use(express.json({limit:'16kb'}));

/* some user contain + or %20 so we want our website can understand every things*/
app.use(express.urlencoded({extended: true, limit:'16kb'}));

/* store static files in public folder*/
app.use(express.static("Public"));
app.use(cookieParser());
export { app };