import ErrorCodes from '../../error_codes';
import { AppError } from './app_error';

export class DatabaseDuplicateError extends AppError {
  constructor(innerError: Error) {
    super(
      ErrorCodes.CONFLICT,
      409,
      'There was a conflict with another entity that has the same attributes.',
      innerError,
    );
  }
}