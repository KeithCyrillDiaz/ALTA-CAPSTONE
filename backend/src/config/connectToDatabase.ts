import mongoose from 'mongoose';
import { configuration } from './dotenv';
import { logger } from 'utils/logger';

export const connectToDatabase = async () => {
    try {
        // Retrieve the MongoDB Atlas connection URL from env through configuration variable
        const MongDB_URL = configuration.MongoDB_URL_Atlas;

        // If the MongoDB URL is not provided, exit the function
        if (!MongDB_URL) {
            logger.error("MongoDB URL is not set");
            return;
        }

        // Set mongoose to use native JavaScript promises
        mongoose.Promise = Promise;

        // Connect to MongoDB using the URL from configuration
        await mongoose.connect(MongDB_URL);

        // Log a message to indicate whether MongoDB is running on Atlas or localhost
        if (MongDB_URL !== configuration.MongoDB_URL_Atlas) {
            console.log("Ready - ".green + "MongoDB is running at localhost");
        } else {
            console.log("Ready - ".green + "MongoDB is running at Atlas");
        }
    } catch (error) {
        // If an error occurs during the connection attempt, log the error
        logger.error("Failed Connecting to MongoDB", error);
    }
};
