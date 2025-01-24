import axios from "axios"
import { logger } from "./logger";
import { configuration } from "../config/dotenv";



export const sendRequestEvery15minutes = () => {
    setInterval ( async () => {
        try {
            logger.event("Sending Dummy Request");
            await axios.get(configuration.backend_URL);
            logger.success("Dummy Request Sent");
        } catch (error) {
            logger.error("error sending request");
        }
    }, 840000); // 840,000 ms = 14 minutes

}