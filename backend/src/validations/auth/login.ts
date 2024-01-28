import { Request, Response, NextFunction } from 'express';
import { validate, Joi } from 'express-validation';

const validationMiddleware = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
});

export default function (req: Request, res: Response, next: NextFunction) {
  validationMiddleware(req, res, next);
}
