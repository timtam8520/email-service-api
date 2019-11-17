
/* eslint-disable no-control-regex */
/* eslint-disable eqeqeq */
import { Recipient, EmailBody, EmailField } from '../types/emailTypes';
import ERROR from '../helpers/errorCodes';

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

/**
 * Ensure that recipient list is valid.
 * If recipient list is not valid, a string is returned with the appropriate error message.
 * @param recipients List of recipients
 * @param field Which recipient list is being verified
 */
function verifyRecipients(recipients: Recipient[], field: EmailField) {
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i += 1) {
    const {
      email,
      name,
    } = recipients[i];

    // intentionally not type checking to fetch values that are null as well
    if (email == undefined) {
      errors.push(ERROR.FIELD_INVALID_OR_EMAIL_MISSING(field, recipients[i]));
    } else if (typeof email !== 'string') {
      errors.push(ERROR.EMAIL_INVALID_TYPE(email, field));
    } else if (!new RegExp(EMAIL_REGEX).test(email)) {
      errors.push(ERROR.EMAIL_INVALID(email, field));
    } else if (name !== undefined && typeof name !== 'string') {
      errors.push(ERROR.NAME_INVALID_TYPE(name, field));
    }
  }

  return errors;
}

function verifyField(field: Recipient[], fieldName: EmailField) {
  const errors: string[] = [];

  if (!field || !Array.isArray(field)) {
    errors.push(ERROR.FIELD_INVALID(fieldName));
  } else if (field.length < 1) {
    errors.push(ERROR.FIELD_MISSING_EMAILS(fieldName));
  } else {
    errors.push(...verifyRecipients(field, fieldName));
  }

  return errors;
}

function verifyContentField(content: string) {
  const errors: string[] = [];

  if (content === undefined) {
    errors.push(ERROR.CONTENT_MISSING);
  } else if (typeof content !== 'string') {
    errors.push(ERROR.CONTENT_INVALID);
  }

  return errors;
}

function verifyRequest(body: EmailBody) {
  const errors: string[] = [];

  errors.push(...verifyField(body.to, 'to'));
  if (body.cc !== undefined) {
    errors.push(...verifyField(body.cc, 'cc'));
  }
  if (body.bcc !== undefined) {
    errors.push(...verifyField(body.bcc, 'bcc'));
  }
  errors.push(...verifyContentField(body.content));

  return errors;
}

export default verifyRequest;
