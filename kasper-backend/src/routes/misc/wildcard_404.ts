import express from 'express';
import ErrorCodes from '../../error_codes';

export function wildcard404(_req: express.Request, res: express.Response) {
  res.status(404).json({
    message: 'Nothing here.',
    code: ErrorCodes.NOT_FOUND,
  });
}
