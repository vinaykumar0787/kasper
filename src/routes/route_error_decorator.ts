import express from 'express';

export function catchRouteErrors(
  target: any,
  _propertyName: any,
  descriptor: any,
) {
  const method = descriptor.value;

  descriptor.value = async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    ...rest: any[]
  ) {
    try {
      return await method.apply(target, [req, res, next, ...rest]);
    } catch (err) {
      next(err);
    }
  };
}
