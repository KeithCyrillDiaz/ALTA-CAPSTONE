"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
// import router from './router';
const colors_1 = __importDefault(require("colors"));
const connectToDatabase_1 = require("./config/connectToDatabase");
const sendIntervalReq_1 = require("./utils/sendIntervalReq");
const dotenv_1 = require("./config/dotenv");
colors_1.default.enable();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
app.get("/", (req, res) => { res.json("Alta Celestia Backend"); });
const port = dotenv_1.configuration.port;
server.listen(port, () => {
    console.log("Ready - ".green + `Server Running on http://localhost:${port}`);
});
(0, connectToDatabase_1.connectToDatabase)();
//sending req to prevent render to sleep every 15m of inactivity
(0, sendIntervalReq_1.sendRequestEvery15minutes)();
// app.use('/kalinga', router());
exports.default = app;
//# sourceMappingURL=server.js.map