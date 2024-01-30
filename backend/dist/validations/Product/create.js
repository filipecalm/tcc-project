"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const validationMiddleware = (0, express_validation_1.validate)({
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        price: express_validation_1.Joi.number().required(),
        description: express_validation_1.Joi.string().required(),
        categoryid: express_validation_1.Joi.required()
    }),
});
function default_1(req, res, next) {
    validationMiddleware(req, res, next);
}
exports.default = default_1;
