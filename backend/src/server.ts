
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import router from './routes';
import colors from 'colors'
import { connectToDatabase } from './config/connectToDatabase';
import { sendRequestEvery15minutes } from './utils/sendIntervalReq';
import { configuration } from './config/dotenv';
import errorHandler from './utils/errorHandler';

colors.enable();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
}));

app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

const server = http.createServer(app)

app.get ("/", (req, res) => {res.json("Alta Celestia Backend")});

const port = configuration.port;

server.listen(port,() => {
    console.log("Ready - ".green + `Server Running on http://localhost:${port}`)
});

connectToDatabase();

//sending req to prevent render to sleep every 15m of inactivity
sendRequestEvery15minutes();

app.use('/altaCelestia', router());
app.use(errorHandler);

export default app;