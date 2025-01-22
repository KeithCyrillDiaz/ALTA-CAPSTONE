"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // ENSURE UPLOADS FOLDER EXIST
        const uploadsDir = './uploads';
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir); // SAVE THE FILES ON UPLOADS FOLDER IN BACKEND SERVER
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // CHANGE FILE ANEM TO AVOID OVERWRITING
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        // ACCEPT PDF FILES ONLY
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});
//# sourceMappingURL=multer.js.map