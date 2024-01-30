"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const validationMiddleware = (0, express_validation_1.validate)({
    body: express_validation_1.Joi.object({
        email: express_validation_1.Joi.string().email().required(),
        password: express_validation_1.Joi.string().required()
    }),
});
function default_1(req, res, next) {
    validationMiddleware(req, res, next);
}
exports.default = default_1;
