

import {google} from 'googleapis'
import dotenv from 'dotenv';
import { gdriveCredentials } from './dotenv';
import { logger } from '../utils/logger';

dotenv.config()

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const {clientEmail, clientKey} = gdriveCredentials;

const JWTClient = new google.auth.JWT(
  clientEmail,
  null,
  clientKey,
  SCOPES
);

JWTClient.authorize(function (err: Error | null) {
  if (err) {
    throw new Error(err.message);
  } else {
    logger.ready("Google Autorization Complete");
  }
});

export default JWTClient;