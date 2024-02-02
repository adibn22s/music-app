const InvariantError = require('../../exceptions/InvariantError');
const { UserSchemaPayload } = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserSchemaPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
