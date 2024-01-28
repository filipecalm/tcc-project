import { Request, Response, NextFunction } from 'express';
import { validate, Joi } from 'express-validation';

const validationMiddleware = validate({
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    categoryid: Joi.required()
  }),
});

export default function (req: Request, res: Response, next: NextFunction) {
  validationMiddleware(req, res, next);
}
