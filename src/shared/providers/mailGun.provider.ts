/* eslint-disable no-throw-literal */

import { Options } from 'request-promise-native';
import btoa from 'btoa';

import { EmailBody, Recipient } from '../types/emailTypes';
import {
  POST,
  postRequest,
  AUTHORIZATION,
  EMAIL_SENT,
} from '../helpers/defaults';
import ERROR from '../helpers/errorCodes';
import { EmailProvider } from './interface.provider';

type MailGunForm = {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  text: string;
};

class MailGunProvider implements EmailProvider {
  BASE_URI: string;

  API_USERNAME: string;

  API_KEY: string;

  constructor() {
    this.API_USERNAME = process.env.MAILGUN_USER;
    this.API_KEY = process.env.MAILGUN_APIKEY;
    this.BASE_URI = 'https://api.mailgun.net/v3';
  }

  getAuthHeader() {
    if (!this.API_USERNAME || this.API_USERNAME.length < 1) {
      throw new Error('Could not connect with the MailGun API, API_USERNAME is missing');
    } else if (!this.API_KEY || this.API_KEY.length < 1) {
      throw new Error('Could not connect with the MailGun API, API_KEY is missing');
    }
    const credentials = btoa(`${this.API_USERNAME}:${this.API_KEY}`);
    return `Basic ${credentials}`;
  }

  static getEmailList(recipients: [Recipient]): string {
    return recipients.map((r) => r.email).join(',');
  }

  static getFormData(body: EmailBody) {
    const formData: MailGunForm = {
      from:
        'Mail Gun <mailgun@sandbox99033cdb05be42aab9d0554e7c95a1fb.mailgun.org>',
      to: this.getEmailList(body.to),
      text: body.content,
    };
    if (!!body.cc && body.cc.length > 0) {
      formData.cc = this.getEmailList(body.cc);
    }
    if (!!body.bcc && body.bcc.length > 0) {
      formData.bcc = this.getEmailList(body.bcc);
    }
    return formData;
  }

  async sendEmail(emailBody: EmailBody): Promise<string> {
    try {
      const authHeader = this.getAuthHeader();
      const formData = MailGunProvider.getFormData(emailBody);

      const options: Options = {
        method: POST,
        uri: `${this.BASE_URI}/sandbox99033cdb05be42aab9d0554e7c95a1fb.mailgun.org/messages`,
        headers: {
          [AUTHORIZATION]: authHeader,
        },
        formData,
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

export default MailGunProvider;
