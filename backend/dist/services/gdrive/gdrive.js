"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilesInGdrive = exports.retrieveFilesInGdrive = exports.uploadCoverLetterInGdrive = exports.uploadResumeInGdrive = exports.uploadFilesInGdrive = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const gdriveConfig_1 = __importDefault(require("../../config/gdriveConfig"));
const logger_1 = require("../../utils/logger");
const dotenv_1 = require("../../config/dotenv");
// UPLOAD FILES
const uploadFilesInGdrive = async (fileObject, folder_id) => {
    try {
        const fileStream = fs_1.default.createReadStream(fileObject.path);
        const { data } = await googleapis_1.google.drive({ version: "v3", auth: gdriveConfig_1.default }).files.create({
            media: {
                mimeType: fileObject.mimetype,
                body: fileStream, // PASS THE READABLE STREAM (FILE CONTENT)
            },
            requestBody: {
                name: fileObject.filename,
                parents: [folder_id], // Specify the folder ID where to upload the file
            },
            fields: "id, name", //REQUEST THE FILE ID AND NAME IN THE RESPONSE 
        });
        return data; // RETURN THE RESPONSE (FILE ID AND NAME)
    }
    catch (err) {
        console.log(err);
    }
};
exports.uploadFilesInGdrive = uploadFilesInGdrive;
//UPLOAD RESUME IN GDRIVE
const uploadResumeInGdrive = async (file, next) => {
    try {
        //GET RESUME FOLDER ID IN ENV
        const folderId = dotenv_1.gdriveCredentials.resumeFolderId;
        //CHECK IF FOLDER ID IS IN ENV
        if (!folderId) {
            //GET THE FILE PATH 
            const filePath = file.path;
            //DELETE THE LOCAL FILE IN UPLOADS FOLDER
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    logger_1.logger.error(`Failed to delete file: ${filePath}`);
                }
                else {
                    logger_1.logger.success("Local file successfully deleted");
                }
            });
            throw new Error("Folder ID for resume is not set");
        }
        //UPLOAD FILES IN GDRIVE
        const result = await (0, exports.uploadFilesInGdrive)(file, folderId);
        //GET THE FILE PATH 
        const filePath = file.path;
        //DELETE THE LOCAL FILE AFTER UPLOADING IN GDRIVE
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                logger_1.logger.error(`Failed to delete file: ${filePath}`);
            }
            else {
                logger_1.logger.success("Local file successfully deleted after upload");
            }
        });
        logger_1.logger.success("File Successfully Uploaded");
        //RETURN THE RESULT DATA TO SAVE THE ID IN DATABASE FOR FUTURE FETCHING
        return result;
    }
    catch (error) {
        //PROCEED TO ERROR HANDLER IF UPLOADING RESUME FAILS
        next(error);
    }
};
exports.uploadResumeInGdrive = uploadResumeInGdrive;
//UPLOAD COVER LETTER IN GDRIVE
const uploadCoverLetterInGdrive = async (file, next) => {
    try {
        //GET COVER LETTER FOLDER ID IN ENV
        const folderId = dotenv_1.gdriveCredentials.coverLetterFolderId;
        //CHECK IF FOLDER ID IS IN ENV
        if (!folderId) {
            throw new Error("Folder ID for cover letter is not set");
        }
        //UPLOAD FILES IN GDRIVE
        const result = await (0, exports.uploadFilesInGdrive)(file, folderId);
        //GET THE FILE PATH 
        const filePath = file.path;
        //DELETE THE LOCAL FILE AFTER UPLOADING IN GDRIVE
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                logger_1.logger.error(`Failed to delete file: ${filePath}`);
            }
            else {
                logger_1.logger.success("Local file successfully deleted after upload");
            }
        });
        //RETURN THE RESULT DATA TO SAVE THE ID IN DATABASE FOR FUTURE FETCHING
        return result;
    }
    catch (error) {
        //PROCEED TO ERROR HANDLER IF UPLOADING RESUME FAILS
        next(error);
    }
};
exports.uploadCoverLetterInGdrive = uploadCoverLetterInGdrive;
//RETRIEVE FILES IN GDRIVE
const retrieveFilesInGdrive = async (fileID) => {
    try {
        const drive = googleapis_1.google.drive({ version: 'v3', auth: gdriveConfig_1.default });
        //FETCH THE FILE META DATA(OPTIONAL BUT USEFUL FOR DEBUGGING) 
        const fileMetadata = await drive.files.get({
            fileId: fileID,
            fields: 'id, name, mimeType, webViewLink',
        });
        //WEBVIEWLINK: https://drive.google.com/file/d/${id}/view
        console.log("File metadata:", fileMetadata.data);
        // Now, download the file. For example, a PDF.
        const fileStream = await drive.files.get({
            fileId: fileID,
            alt: 'media', // This fetches the actual file content, not metadata.
        }, { responseType: 'stream' } // This returns the file as a stream.
        );
        // Save the file locally (e.g., to a PDF file)
        const fileName = fileMetadata.data.name || 'downloadedFile.pdf'; // Using file name or fallback to default name
        const filePath = `./${fileName}`;
        fileStream.data.pipe(fs_1.default.createWriteStream(filePath));
        // Return the file details and download path
        return {
            fileMetadata: fileMetadata.data,
            downloadPath: filePath,
        };
    }
    catch (error) {
        console.error('Error retrieving file:', error);
        throw new Error('Failed to retrieve file from Google Drive');
    }
};
exports.retrieveFilesInGdrive = retrieveFilesInGdrive;
// DELETE FILES
const deleteFilesInGdrive = async (fileID) => {
    try {
        const { data } = await googleapis_1.google
            .drive({ version: "v3", auth: gdriveConfig_1.default })
            .files.delete({
            fileId: fileID,
        });
        logger_1.logger.success("File deleted successfully In Gdrive");
        return data;
    }
    catch (err) {
        logger_1.logger.error("Error Deleting Files in Gdrive:", err.message);
    }
};
exports.deleteFilesInGdrive = deleteFilesInGdrive;
//# sourceMappingURL=gdrive.js.map