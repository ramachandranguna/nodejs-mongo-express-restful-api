const mongoose = require('mongoose')
const {
  SuccessResponse,
  FailureResponse,
} = require('../../../extensions/response.extension')
const uniqid = require('uniqid')
const CreateAccountEmmiter = require('../events/create-user.event')
const AuthService = require('../../auth/services/auth.service')

class PublicController {
  static async createLocal(req, res, next) {
    try {
      // Adding the user to auth module setting account type as local.
      const {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      } = req.body
      const referenceId = new mongoose.Types.ObjectId()
      const auth = await AuthService.create({
        email,
        password,
        reference_id: referenceId,
        email_alias: uniqid(`${firstName.substring(0, 3).toLowerCase()}`), // Mask Email alias - usefull with chat/email conversations(rama-sdevs1ac@mail.boilerplate.com)
        first_name: firstName,
        last_name: lastName,
      })
      // Create User Account.
      CreateAccountEmmiter.emit(
        'create-user-on-register',
        referenceId,
        req.body
      )
      next(SuccessResponse(201).set(AuthService.returnToken(auth)))
    } catch (e) {
      console.log(e)
      if ('status' in e) {
        next(e)
      } else {
        next(FailureResponse(500).set('Something went wrong!!!'))
      }
    }
  }
}

module.exports = PublicController
