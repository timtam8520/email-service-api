import rp from 'request-promise-native';

export const POST = 'POST';
export const AUTHORIZATION = 'Authorization';

export const EMAIL_SENT = 'Successfully sent email :)';

export const MAX_RETRIES = 5;

export function postRequest(options: rp.Options) {
  return new Promise((resolve, reject) => {
    rp.post(options)
      .then((body) => resolve(body))
      .catch((err) => reject(err));
  });
}
