const Joi = require("joi");

exports.sendEmailCodeSchema = Joi.object({
    email: Joi.string().email().required()
})