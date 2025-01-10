import axios from "axios"
import { logger } from "./logger";



export const sendRequestEvery15minutes = () => {
    setInterval ( async () => {
        try {
            logger.event("Sending Dummy Request");
            await axios.get('http://localhost:3000');
            logger.success("Dummy Request Sent");
        } catch (error) {
            logger.error("error sending request");
        }
    }, 900000); // 900000 ms = 15 minutes

}