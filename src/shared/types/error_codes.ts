const STATUS_CODE = {
  FIELD_INVALID: (field: string) => `The field '${field}' is invalid in the request!`,
  FIELD_INVALID_OR_EMAIL_MISSING: (field: string) => `The field '${field}' may be invalid or one or more 'email(s)' are missing`,
  NAME_INVALID_TYPE: (name: string, field: string) => `The name '${name}' is invalid in the field '${field}'`,
  EMAIL_EMPTY: (field: string) => `One or more 'email(s)' are empty in the field '${field}'`,
  EMAIL_INVALID: (email: string, prop: string) => `The email '${email}' is invalid, in the field '${prop}'`,
  CONTENT_MISSING: 'You must provide the field \'content\' in the request!',
  CONTENT_INVALID: 'The field \'content\' is not of a valid type. It must be a string',
};

export default STATUS_CODE;
