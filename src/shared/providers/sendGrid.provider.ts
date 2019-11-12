/* eslint-disable no-throw-literal */
import { Options } from 'request-promise-native';

import { EmailBody, Recipient } from '../types/emailTypes';
import {
  POST,
  AUTHORIZATION,
  postRequest,
  EMAIL_SENT,
} from '../helpers/defaults';
import ERROR from '../helpers/errorCodes';
import { EmailProvider } from './interface.provider';

type SendGridBody = {
  personalizations: [{
    to: [Recipient];
    cc: [Recipient];
    bcc: [Recipient];
    subject: string;
  }],
  from: Recipient,
  content: [{
    type: string;
    value: string;
  }]
};

class SendGridProvider implements EmailProvider {
  API_KEY: string;

  BASE_URI: string;

  constructor() {
    this.API_KEY = process.env.SENDGRID_APIKEY;
    this.BASE_URI = 'https://api.sendgrid.com/v3';
  }

  getAuthHeader() {
    if (!this.API_KEY || this.API_KEY.length < 1) {
      throw new Error('Could not connect with the SendGrid API, API_KEY is missing');
    }
    return `Bearer ${this.API_KEY}`;
  }

  static getBody(body: EmailBody): SendGridBody {
    return {
      personalizations: [
        {
          to: body.to,
          cc: body.cc,
          bcc: body.bcc,
          subject: 'Hello, World!',
        },
      ],
      from: {
        email: 'test@example.com',
        name: 'John Doe',
      },
      content: [
        {
          type: 'text/plain',
          value: body.content,
        },
      ],
    };
  }

  async sendEmail(emailBody: EmailBody): Promise<string> {
    try {
      const authHeader = this.getAuthHeader();
      const body = SendGridProvider.getBody(emailBody);

      const options: Options = {
        method: POST,
        uri: `${this.BASE_URI}/mail/send`,
        headers: {
          [AUTHORIZATION]: authHeader,
        },
        body,
        json: true,
      };

      try {
        await postRequest(options);
        return EMAIL_SENT;
      } catch (error) {
        throw ERROR.PROVIDER_SEND_FAIL(error);
      }
    } catch (error) {
      throw ERROR.PROVIDER_ERROR(error);
    }
  }
}

export default SendGridProvider;
