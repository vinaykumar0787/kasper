import express from 'express';
import { v4 as uuid } from 'uuid';
import ErrorCodes from '../error_codes';
import { AppError } from '../types/errors/app_error';

export async function uncaughtError(
  err: Error,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.httpCode).json({
      message: err.message,
      code: err.appCode,
    });
  } else {
    return res.status(400).json({
      message: err.message,
      code: ErrorCodes.BAD_REQUEST,
    });
  }

  const errorId = uuid();

  req.log.error({ err, errorId });

  res.status(500).json({
    code: ErrorCodes.INTERNAL,
    message: `An internal error has occurred. It has been logged. Please retry.`,
    errorId,
  });

  if (process.env.NODE_ENV !== 'test') {
    console.warn(err);
  }

  return;
}
