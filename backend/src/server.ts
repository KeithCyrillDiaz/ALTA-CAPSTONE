
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
// import router from './router';

import colors from 'colors'
import { connectToDatabase } from 'config/connectToDatabase';
colors.enable();


const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())

const server = http.createServer(app)

app.get ("/", (req, res) => {res.json("Alta Celestia Backend")})

const MongDB_URL = process.env.MONGO_DB_ATLAS

if (!MongDB_URL) {
    throw new Error("MongoDB URL is not defined");
}

server.listen(3000,() => {
    console.log("Ready - ".green + "Server Running on http://localhost:3000")
});

connectToDatabase();


// app.use('/kalinga', router());


export default app;