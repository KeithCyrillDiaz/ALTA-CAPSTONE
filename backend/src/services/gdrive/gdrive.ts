import { google } from "googleapis";
import fs from "fs";
import authorize from '../../config/gdriveConfig';
import { logger } from "../../utils/logger";
import { NextFunction } from "express";
import { gdriveCredentials } from "../../config/dotenv";

interface FileUpload {
  fieldname: string;        
  originalname: string;      
  encoding: string;         
  mimetype: string;         
  destination: string;      
  filename: string;          
  path: string;              
  size: number;            
}

// UPLOAD FILES
export const uploadFilesInGdrive = async (fileObject:FileUpload, folder_id: string) => {
  try {

    const fileStream = fs.createReadStream(fileObject.path);

    const { data } = await google.drive({ version: "v3", auth: authorize }).files.create({
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

    return data;  // RETURN THE RESPONSE (FILE ID AND NAME)

  } catch (err) {
    console.log(err);
  }
};


//UPLOAD RESUME IN GDRIVE
export const uploadResumeInGdrive = async (file: FileUpload, next: NextFunction) => {
  try {
    //GET RESUME FOLDER ID IN ENV
    const folderId = gdriveCredentials.resumeFolderId;

     //CHECK IF FOLDER ID IS IN ENV
     if(!folderId) {
      //GET THE FILE PATH 
        const filePath = file.path;

      //DELETE THE LOCAL FILE IN UPLOADS FOLDER
        fs.unlink(filePath, (err) => {
          if (err) {
              logger.error(`Failed to delete file: ${filePath}`);
          } else {
              logger.success("Local file successfully deleted");
          }
      });

      throw new Error("Folder ID for resume is not set");
      
    }

    //UPLOAD FILES IN GDRIVE
    const result = await uploadFilesInGdrive(file, folderId);

    //GET THE FILE PATH 
    const filePath = file.path;

    //DELETE THE LOCAL FILE AFTER UPLOADING IN GDRIVE
    fs.unlink(filePath, (err) => {
        if (err) {
            logger.error(`Failed to delete file: ${filePath}`);
        } else {
            logger.success("Local file successfully deleted after upload");
        }
    });

    logger.success("File Successfully Uploaded");

    //RETURN THE RESULT DATA TO SAVE THE ID IN DATABASE FOR FUTURE FETCHING
    return result;

  } catch (error) {
    //PROCEED TO ERROR HANDLER IF UPLOADING RESUME FAILS
    next(error);
  }
}

//UPLOAD COVER LETTER IN GDRIVE
export const uploadCoverLetterInGdrive = async (file: FileUpload, next: NextFunction) => {
  try {
    //GET COVER LETTER FOLDER ID IN ENV
    const folderId = gdriveCredentials.coverLetterFolderId;

    //CHECK IF FOLDER ID IS IN ENV
    if(!folderId) {
      throw new Error("Folder ID for cover letter is not set");
    }

    //UPLOAD FILES IN GDRIVE
    const result = await uploadFilesInGdrive(file, folderId);

    //GET THE FILE PATH 
    const filePath = file.path;

    //DELETE THE LOCAL FILE AFTER UPLOADING IN GDRIVE
    fs.unlink(filePath, (err) => {
        if (err) {
            logger.error(`Failed to delete file: ${filePath}`);
        } else {
            logger.success("Local file successfully deleted after upload");
        }
    });

    //RETURN THE RESULT DATA TO SAVE THE ID IN DATABASE FOR FUTURE FETCHING
    return result;

  } catch (error) {
    //PROCEED TO ERROR HANDLER IF UPLOADING RESUME FAILS
    next(error);
  }
}


//RETRIEVE FILES IN GDRIVE
export const retrieveFilesInGdrive = async (fileID: string) => {
    try {

      const drive = google.drive({ version: 'v3', auth: authorize});

      //FETCH THE FILE META DATA(OPTIONAL BUT USEFUL FOR DEBUGGING) 
      const fileMetadata = await drive.files.get({
        fileId: fileID,
        fields: 'id, name, mimeType, webViewLink',
      });

       //WEBVIEWLINK: https://drive.google.com/file/d/${id}/view
  
      console.log("File metadata:", fileMetadata.data);
  
      // Now, download the file. For example, a PDF.
      const fileStream = await drive.files.get(
        {
          fileId: fileID,
          alt: 'media', // This fetches the actual file content, not metadata.
        },
        { responseType: 'stream' } // This returns the file as a stream.
      );
  
      // Save the file locally (e.g., to a PDF file)
      const fileName = fileMetadata.data.name || 'downloadedFile.pdf'; // Using file name or fallback to default name
      const filePath = `./${fileName}`;
  
      fileStream.data.pipe(fs.createWriteStream(filePath));
  
      // Return the file details and download path
      return {
        fileMetadata: fileMetadata.data,
        downloadPath: filePath,
      };
    } catch (error) {
      console.error('Error retrieving file:', error);
      throw new Error('Failed to retrieve file from Google Drive');
    }
  };

// DELETE FILES
export const deleteFilesInGdrive = async (fileID: string) => {
  try {
    const { data } = await google
      .drive({ version: "v3", auth: authorize })
      .files.delete({
        fileId: fileID,
      });
    logger.success("File deleted successfully In Gdrive");
    return data;
  } catch (err) {
    logger.error("Error Deleting Files in Gdrive:", err.message); 
  }
};


