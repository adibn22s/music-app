/* eslint-disable import/no-extraneous-dependencies */

const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { AlbumsPayloadSchema };
