import { Response } from 'express';

export function ok(res: Response, payload = {}) {
  res.status(200).send(payload);
}

export function InternalServerError(res: Response) {
  res.status(500).send('Internal Server Error');
}
