import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import * as verifyRequest from '../verifyRequest.service';
import * as defaultProvider from '../../providers/default.provider';
import { EMAIL_SENT } from '../../helpers/defaults';
import trySendEmail from '../email.service';
import MockResponse from '../../../../test/mock.response';
import ERROR from '../../helpers/errorCodes';

describe('email.service', () => {
  let sandbox: SinonSandbox;
  let verifyRequestStub: SinonStub;
  let sendEmailStub: SinonStub;
  let res: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    verifyRequestStub = sandbox.stub(verifyRequest, 'default').returns([]);
    sendEmailStub = sandbox.stub(defaultProvider, 'default').returns(Promise.resolve(EMAIL_SENT));

    res = new MockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to return a successful email response', async () => {
    await trySendEmail({} as any, res);

    expect(verifyRequestStub.callCount).to.be.equal(1);
    expect(sendEmailStub.callCount).to.be.equal(1);

    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.equal(EMAIL_SENT);
  });

  it('should send a bad request if there are any errors in the body', async () => {
    const errors = [ERROR.CONTENT_INVALID];
    verifyRequestStub.returns(errors);
    await trySendEmail({} as any, res);

    expect(verifyRequestStub.callCount).to.be.equal(1);
    expect(sendEmailStub.callCount).to.be.equal(0);

    expect(res.httpStatus).to.equal(400);
    expect(res.payload).to.deep.equal({ errors });
  });

  it('should send a bad request if there are any errors returned from the email provider', async () => {
    const error = [ERROR.PROVIDER_SEND_FAIL('random')];
    sendEmailStub.throws(error);
    await trySendEmail({} as any, res);

    expect(verifyRequestStub.callCount).to.be.equal(1);
    expect(sendEmailStub.callCount).to.be.equal(1);

    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.deep.equal({ error });
  });
});
