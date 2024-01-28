import { Request, Response, NextFunction } from 'express';
import { validate, Joi } from 'express-validation';

const validationMiddleware = validate({
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmpassword: Joi.string().min(8).required(),
    cpf: Joi.string().required(),
    rg: Joi.string(),
    birth: Joi.date(),
    phone: Joi.string().required(),
    gender: Joi.string().required()
  }),
});

export default function (req: Request, res: Response, next: NextFunction) {
  validationMiddleware(req, res, next);
}
