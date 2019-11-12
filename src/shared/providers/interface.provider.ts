import { EmailBody } from '../types/emailTypes';

export interface EmailProvider {
  API_KEY: string;
  BASE_URI: string;

  sendEmail(emailBody: EmailBody): Promise<string>;
}
