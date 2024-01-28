import { UnauthorizedError } from 'express-jwt'
import { ValidationError } from 'express-validation'
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

export default (error:ErrorRequestHandler , req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error)
  }

  if (error instanceof UnauthorizedError) {
    return res.status(error.status).json(error)
  }
  return res.status(500).json(error)
}
