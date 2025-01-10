
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
// import router from './router';

import colors from 'colors'
import { connectToDatabase } from './config/connectToDatabase';
import { sendRequestEvery15minutes } from './utils/sendIntervalReq';
import { configuration } from './config/dotenv';

colors.enable();


const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

const server = http.createServer(app)

app.get ("/", (req, res) => {res.json("Alta Celestia Backend")});

const port = configuration.port;

server.listen(port,() => {
    console.log("Ready - ".green + "Server Running on http://localhost:3000")
});

connectToDatabase();

//sending req to prevent render to sleep every 15m of inactivity
sendRequestEvery15minutes();


// app.use('/kalinga', router());


export default app;