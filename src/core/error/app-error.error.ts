export class HttpException extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly details: unknown;

  constructor(message: string, statusCode: number, error: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.details = details ?? null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, 400, 'Bad Request', details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, 401, 'Unauthorized', details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden', details?: unknown) {
    super(message, 403, 'Forbidden', details);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found', details?: unknown) {
    super(message, 404, 'Not Found', details);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, 409, 'Conflict', details);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(message, 500, 'Internal Server Error', details);
  }
}

// Backward compatibility alias for AppError
export class AppError extends HttpException {
  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details?: unknown,
  ) {
    super(message, statusCode, code, details);
  }
}
