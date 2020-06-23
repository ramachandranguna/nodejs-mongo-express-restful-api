const AuthValidation = require('./public')

const login = [...AuthValidation.email, ...AuthValidation.password]

module.exports = {
  login,
}
