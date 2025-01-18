import dotenv from 'dotenv';

dotenv.config()

export const configuration = {
    MongoDB_URL_Local: process.env.MONGODB_URI_LOCAL,
    MongoDB_URL_Atlas: process.env.MONGODB_URI_ATLAS,
    backend_URL: process.env.BACKEND_URL,
    port: process.env.PORT || 3000,
    refresh_secret_key: process.env.REFRESH_TOKEN_KEY,
    access_secret_key: process.env.ACCESS_TOKEN_KEY,
    admin_pass: process.env.ADMIN_PASS,
    admin_user: process.env.ADMIN_USER,
}

export const geminiConfig= {
    apiKey: process.env.GEMINI_API_KEY,
    modelName: process.env.GEMINI_MODEL_NAME
}

export const gdriveCredentials = {
    resumeFolderId: process.env.GDRIVE_RESUME_FOLDER_ID,
    coverLetterFolderId: process.env.GDRIVE_COVER_LETTER_FOLDER_ID,
    clientEmail: process.env.GDRIVE_CLIENT_EMAIL,
    clientKey: process.env.GDRIVE_CLIENT_PRIVATE_KEY,
}

export const gmailCredentials = {
    clientEmail: process.env.GMAIL_EMAIL,
    clientAppPassword: process.env.GMAIL_APP_PASSWORD,
    contactEmail: process.env.GMAIL_CONTACT_EMAIL
}
