const Joi = require('joi');

const UserSchemaPayload = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = { UserSchemaPayload };
