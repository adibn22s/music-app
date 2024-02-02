/* eslint-disable object-curly-newline */
const mapDBToModelDetail = ({ id, title, year, genre, performer, duration, albumId }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

const mapDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModelDetail, mapDBToModel };
