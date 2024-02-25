import { UnauthorizedError } from 'express-jwt'
import { ValidationError } from 'express-validation'
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import MESSAGE from '../constants/messages';
export default (error:ErrorRequestHandler , req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error)
  }

  if (error instanceof UnauthorizedError) {
    return res.status(error.status || 401).json({ message: MESSAGE.ERROR.ACCESS_DENIED });
  }

  if (process.env.NODE_ENV === 'dev') {
    return res.status(500).json({ message: MESSAGE.ERROR.ERROR_CATCH });
  } else {
    return res.status(500).json({ message: MESSAGE.ERROR.ERROR_CATCH });
  }
}
