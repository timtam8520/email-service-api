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

  it('should be able to report that the "bcc"  field contains an email of invalid type', () => {
    const invalid = { email: 987 };
    const request: any = {
      to: [{ email: 'good@email.com ' }],
      bcc: [invalid],
    };

    const errors = verifyRequest(request);
    verifyErrorsContainElement(errors, ERROR.FIELD_INVALID_OR_EMAIL_MISSING('bcc', invalid));
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
});
