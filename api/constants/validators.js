const Joi = require("joi");

exports.sendEmailCodeSchema = Joi.object({
    email: Joi.string().email().required()
});

exports.signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(64).max(64).required(),
    code: Joi.string().required()
})