import dotenv from 'dotenv';

dotenv.config()

export const configuration = {
    MongoDB_URL_Local: process.env.MONGODB_URI_LOCAL,
    MongoDB_URL_Atlas: process.env.MONGODB_URI_ATLAS,
    backend_URL: process.env.BACKEND_URL,
    port: process.env.PORT || 3000,
    jwt_secret_admin: process.env.JWT_SECRET_KEY_ADMIN,
    admin_pass: process.env.ADMIN_PASS,
    admin_user: process.env.ADMIN_USER,
    encryptionKey: process.env.OWN_SECRET_KEY,
    localOrigin: process.env.LOCAL_ORIGIN,
    globalOrigin: process.env.GLOBAL_ORIGIN
}
