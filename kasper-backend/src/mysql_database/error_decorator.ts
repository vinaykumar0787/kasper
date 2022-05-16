import assert from 'assert';
import { DatabaseDuplicateError } from '../types/errors/database_duplicate_error';
import { DatabaseReferenceError } from '../types/errors/database_reference_error';

export function translateMySQLErrors(target: Function) {
  for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      propertyName,
    )!;

    if (descriptor.value instanceof Function) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        const returnValue = originalMethod.apply(this, args);

        assert(
          returnValue instanceof Promise,
          'MySQL function is expected to return a promise',
        );
        return returnValue.catch((err) => {
          if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new DatabaseReferenceError(err);
          } else if (err.code === 'ER_DUP_ENTRY') {
            throw new DatabaseDuplicateError(err);
          }

          throw err;
        });
      };

      Object.defineProperty(target.prototype, propertyName, descriptor);
    }
  }
}
