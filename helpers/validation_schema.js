const Joi = require('joi');

const UserSchema =Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.number().integer().required(),
    age: Joi.number().integer().required(),
    ssnno: Joi.number().integer().required(),
});

const UserId= Joi.object({           
   userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const UpdateUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.number().integer().required(),
    age: Joi.number().integer().required(),
    ssnno: Joi.number().integer().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})

module.exports = {
UserSchema, UserId, loginSchema, UpdateUserSchema
};
