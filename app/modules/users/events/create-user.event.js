const EventEmitter = require('events')

class CreateUserEvent extends EventEmitter {}
const CreateUserEmitter = new CreateUserEvent()

const mongoose = require('mongoose')

const User = mongoose.model('user')

CreateUserEmitter.on(
  'create-user-on-register',
  async (_id, { first_name: firstName, last_name: lastName }) => {
    new User({
      first_name: firstName,
      last_name: lastName,
      _id,
    })
      .save()
      .then(e => {
        console.log(e)
      })
      .catch(e => {
        console.log(e)
      })
  }
)

module.exports = CreateUserEmitter
