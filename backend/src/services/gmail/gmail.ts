import nodemailer from 'nodemailer';
import { logger } from '../../utils/logger';
import { gmailCredentials } from '../../config/dotenv';

export const sendEmail = async (recipientEmail:string, subject: string, htmlContent: string) => {
    try {  
        logger.event("Sending Email");

        //SET UP EMAIL TRANSPORTER
        const {clientAppPassword, clientEmail} = gmailCredentials;
    
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: clientEmail, // EMAIL ADDRESS OF GMAIL
              pass: clientAppPassword, // GENERATED APP PASSWORD
            },
          });

        //EMAIL OPTIONS
        const mailOptions = {
            from: clientEmail, // SENDER'S EMAIL ADDRESS
            to: recipientEmail, // RECIPIENT EMAIL
            subject, // SUBJECT EMAIL
            html: htmlContent, // BODY OF THE EMAIL
        };

        //SEND EMAIL
        await transporter.sendMail(mailOptions);
        logger.success(`Email sent successfully to ${recipientEmail}`);

    } catch (error) {
        logger.error("Failed to Send email", error);
    }
}