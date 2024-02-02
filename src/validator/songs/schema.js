/* eslint-disable import/no-extraneous-dependencies */

const Joi = require('joi');

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().required(),
  albumId: Joi.string(),
});

module.exports = { SongsPayloadSchema };
