/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */

import { EmailBody } from '../types/emailTypes';
import MailGunProvider from './mailGun.provider';
import SendGridProvider from './sendGrid.provider';
import { EmailProvider } from './interface.provider';
import { MAX_RETRIES } from '../helpers/defaults';

type Result = {
  done: boolean;
  res: string;
};

/**
 * If a new provider is added, add to this list and they will be used
 * if the other email providers are not successfully sending emails
 */
const emailProviders = [
  MailGunProvider,
  SendGridProvider,
];

function Activator<T extends EmailProvider>(Type: { new(): T; }): T {
  return new Type();
}


async function safeRetry(fn: Function, retry = 0): Promise<Result> {
  return new Promise((resolve, reject) => {
    const timeOut = (2 ** retry) * 100;

    if (retry > MAX_RETRIES) {
      console.error('Retries exceeded!');
      return reject({
        done: false,
        res: '',
      });
    }
    setTimeout(async () => {
      try {
        try {
          const res = await fn();
          resolve({
            done: true,
            res,
          });
        } catch (error) {
          console.error(`Retry ${retry}`, `Retrying again in ${timeOut}ms`, error);
          resolve(await safeRetry(fn, retry + 1));
        }
      } catch (error) {
        reject(error);
      }
    }, timeOut);
  });
}

async function sendEmail(body: EmailBody) {
  let providerIndex = 0;
  const providers = emailProviders.map((p) => Activator(p));
  let chosenProvider = providers[providerIndex % providers.length];

  let sentStatus: Result = {
    done: false,
    res: '',
  };

  while (!sentStatus.done) {
    try {
      sentStatus = await safeRetry(() => chosenProvider.sendEmail(body));
      const msg = sentStatus.res;
      console.log(msg);
      return msg;
    } catch (err) {
      console.error(err, 'Switching email providers');
      providerIndex += 1;
      chosenProvider = providers[providerIndex % providers.length];
    }
  }
}

export default sendEmail;
