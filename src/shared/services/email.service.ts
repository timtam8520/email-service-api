import { Request, Response } from 'express';
import { ok, badRequest } from './api.service';
import verifyRequest from './verifyRequest.service';

function trySendEmail(req: Request, res: Response) {
  try {
    const errors = verifyRequest(req.body);
    if (errors.length > 0) {
      return badRequest(res, { errors });
    }
    return ok(res);
  } catch (error) {
    badRequest(res);
  }
  return true;
}

export default trySendEmail;
