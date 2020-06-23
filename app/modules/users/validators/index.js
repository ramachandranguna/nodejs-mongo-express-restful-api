const UserValidations = require('./basic')

const register = [
  ...UserValidations.firstName,
  ...UserValidations.lastName,
  ...UserValidations.email,
  ...UserValidations.emailExist,
  ...UserValidations.password,
]

module.exports = {
  register,
}
