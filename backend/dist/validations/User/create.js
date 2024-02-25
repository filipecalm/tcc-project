"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const validationMiddleware = (0, express_validation_1.validate)({
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().required(),
        password: express_validation_1.Joi.string().min(8).required(),
        confirmPassword: express_validation_1.Joi.string().min(8).required(),
        cpf: express_validation_1.Joi.string().required(),
        rg: express_validation_1.Joi.string(),
        birth: express_validation_1.Joi.date(),
        phone: express_validation_1.Joi.string().required(),
        gender: express_validation_1.Joi.string().required()
    }),
});
function default_1(req, res, next) {
    validationMiddleware(req, res, next);
}
exports.default = default_1;
