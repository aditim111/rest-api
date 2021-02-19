const Joi = require('joi');

const UserSchema = Joi.array().items(Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.number().integer().required(),
    age: Joi.number().integer().required(),
    ssnno: Joi.number().integer().required(),
}));

module.exports = {
UserSchema
};