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
    localOrigin: process.env.LOCAL_ORIGIN,
    globalOrigin: process.env.GLOBAL_ORIGIN
}
