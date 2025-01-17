import multer from "multer";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

    // ENSURE UPLOADS FOLDER EXIST
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

      cb(null, uploadsDir); // SAVE THE FILES ON UPLOADS FOLDER IN BACKEND SERVER
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // CHANGE FILE ANEM TO AVOID OVERWRITING
    }
  });

export const upload = multer({
storage,
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
fileFilter: (req, file, cb) => {
    // ACCEPT PDF FILES ONLY
    if (file.mimetype === 'application/pdf') {
    cb(null, true);
    } else {
    cb(new Error('Only PDF files are allowed!')as any, false);
    }
}
});