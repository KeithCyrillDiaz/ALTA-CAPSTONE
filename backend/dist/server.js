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
const MongDB_URL = process.env.MONGO_DB_ATLAS;
if (!MongDB_URL) {
    throw new Error("MongoDB URL is not defined");
}
server.listen(3000, () => {
    console.log("Ready - ".green + "Server Running on http://localhost:3000");
});
(0, connectToDatabase_1.connectToDatabase)();
// app.use('/kalinga', router());
exports.default = app;
//# sourceMappingURL=server.js.map