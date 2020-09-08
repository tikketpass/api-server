const Joi = require("joi");

exports.sendEmailCodeSchema = Joi.object({
    email: Joi.string().email().required()
});

exports.signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(64).max(64).required(),
    code: Joi.string().required()
})

exports.signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(64).max(64).required(),
    role: Joi.string().valid("HOST", "PARTICIPANT").required()
})

exports.createConcertSchema = Joi.object({
    name: Joi.string().required(),
    place: Joi.string().required(),
    startTime: Joi.date().required(),
    enterTime: Joi.date().required()
})

exports.updateConcertSchema = Joi.object({
    name: Joi.string().required(),
    place: Joi.string().required(),
    startTime: Joi.date().required(),
    enterTime: Joi.date().required()
});

exports.useTicketSchema = Joi.object({
    qrData: Joi.string().required()
})