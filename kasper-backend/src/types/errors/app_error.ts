export abstract class AppError extends Error {
  constructor(
    public readonly appCode: number,
    public readonly httpCode: number,
    public readonly message: string,
    public readonly innerError?: Error,
  ) {
    super(message);
    this.appCode = appCode;
    this.httpCode = httpCode;
    this.message = message;
    this.innerError = innerError;
  }
}
