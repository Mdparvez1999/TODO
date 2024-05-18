const joi = require("joi");

const todoValidation = joi.object({
    description: joi.string().required().trim(),
    status: joi.string().required().trim()
});

module.exports = todoValidation;