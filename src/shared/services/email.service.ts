import { Request, Response } from 'express';
import { ok, badRequest } from './api.service';
import verifyRequest from './verifyRequest.service';
import sendEmail from '../providers/default.provider';

async function trySendEmail(req: Request, res: Response) {
  try {
    const errors = verifyRequest(req.body);
    if (errors.length > 0) {
      return badRequest(res, { errors });
    }
    const result = await sendEmail(req.body);
    return ok(res, result);
  } catch (error) {
    badRequest(res);
  }
  return true;
}

export default trySendEmail;
