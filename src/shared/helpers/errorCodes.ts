import { EmailField } from '../types/emailTypes';

const ERROR = {
  FIELD_INVALID: (field: EmailField) => `The field '${field}' is invalid in the request. Please ensure that it is an array!`,
  FIELD_MISSING_EMAILS: (field: EmailField) => `The field '${field}' has no emails provided. Please ensure to provide at least one email!`,
  FIELD_INVALID_OR_EMAIL_MISSING: (field: EmailField, elem: any) => `The field '${field}' contains one or more invalid elements or the 'email' properties are missing. Invalid element => ${JSON.stringify(elem)}`,
  NAME_INVALID_TYPE: (name: string, field: EmailField) => `The name '${name}' is invalid in the field '${field}'`,
  EMAIL_EMPTY: (field: EmailField) => `One or more 'email(s)' are empty in the field '${field}'`,
  EMAIL_INVALID: (email: string, field: EmailField) => `The email '${email}' is invalid, in the field '${field}'`,
  CONTENT_MISSING: 'You must provide the field \'content\' in the request!',
  CONTENT_INVALID: 'The field \'content\' is not of a valid type. It must be a string',
  PROVIDER_ERROR: (err: string) => `There was an issue with the provider. Could not send email. ${err}`,
  PROVIDER_SEND_FAIL: (err: string) => `Could not send the email! ${err}`,
};

export default ERROR;
