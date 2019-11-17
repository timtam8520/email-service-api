import sinon, { SinonSandbox } from 'sinon';
import {
  describe,
  beforeEach,
  afterEach,
  it,
} from 'mocha';
import { expect } from 'chai';
import verifyRequest from '../verifyRequest.service';
import { EmailBody } from '../../types/emailTypes';
import ERROR from '../../helpers/errorCodes';

function verifyErrorsContainElement(errors: any, elem: any) {
  expect(errors).to.be.an('array').that.includes(elem);
}

describe('verifyRequest.service', () => {
  let sandbox: SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to to report that that the "to" field is missing', () => {
    const errors = verifyRequest({} as EmailBody);
    verifyErrorsContainElement(errors, ERROR.FIELD_INVALID('to'));
  });

  it('should be able to report that the "content" field is missing', () => {
    const errors = verifyRequest({} as EmailBody);
    verifyErrorsContainElement(errors, ERROR.CONTENT_MISSING);
  });

  it('should be able to report that the "cc" field is invalid', () => {
    const request: any = {
      to: [{ email: 'hello@emamil.com' }],
      cc: {},
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.FIELD_INVALID('cc'));
  });

  it('should be able to report that the "bcc" field does not contain any emails', () => {
    const request: any = {
      to: [{ email: 'hello@gmail.com' }],
      bcc: [],
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.FIELD_MISSING_EMAILS('bcc'));
  });

  it('should be able to report that the "cc" field contains an invalid or missing email', () => {
    const invalid: any = { email: null };
    const request: any = {
      to: [{ email: 'good@email.com' }],
      cc: [invalid],
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.FIELD_INVALID_OR_EMAIL_MISSING('cc', invalid));
  });

  it('should be able to report that the "bcc" field contains an email of invalid type', () => {
    const invalid = { email: 987 };
    const request: any = {
      to: [{ email: 'good@email.com ' }],
      bcc: [invalid],
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.EMAIL_INVALID_TYPE(invalid.email, 'bcc'));
  });

  it('should be able to report that the "to" field contains an invalid email', () => {
    const invalidEmail = 'invalidEmail.com';
    const request: EmailBody = {
      to: [
        { email: 'valid@email.com' },
        { email: invalidEmail },
      ],
      content: 'content',
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.EMAIL_INVALID(invalidEmail, 'to'));
  });

  it('should be able to report that the name field is not of a valid type', () => {
    const invalidName = /someRegex/;
    const request: any = {
      to: [{
        email: 'valid@email.com',
        name: invalidName,
      }],
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.NAME_INVALID_TYPE(invalidName, 'to'));
  });

  it('should be able to report that there are no errors in the request', () => {
    const validRequest: EmailBody = {
      to: [
        {
          email: 'email1@org.com.au',
          name: 'Email 1',
        },
        {
          email: 'temp@email.com',
        },
      ],
      cc: [{
        email: 'other@email.com',
      }],
      content: 'Some cracker content!!',
    };

    const errors = verifyRequest(validRequest);
    expect(errors).to.be.an('array').that.has.lengthOf(0);
  });
});
