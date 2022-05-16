import ErrorCodes from '../../error_codes';
import { AppError } from './app_error';

export class DatabaseReferenceError extends AppError {
  constructor(innerError: Error) {
    super(
      ErrorCodes.CONFLICT,
      409,
      'Database reference error (probably you specified an entity ID that does not exist).',
      innerError,
    );
  }
}
