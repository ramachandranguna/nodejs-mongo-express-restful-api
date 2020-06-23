const AuthService = require('../services/auth.service')
const {
  SuccessResponse,
  FailureResponse,
} = require('../../../extensions/response.extension')

class AuthController {
  static async loginLocal(req, res, next) {
    try {
      const { email, password, type } = req.body
      const auth = await AuthService.login({
        email,
        password,
        type,
      })
      next(SuccessResponse(201).set(AuthService.returnToken({ ...auth })))
    } catch (e) {
      if ('status' in e) {
        next(e)
      } else {
        next(FailureResponse(500).set('Something went wrong!!!'))
      }
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const { verification_token: verificationToken } = req.params
      await AuthService.verify(verificationToken)
      next(
        SuccessResponse(200).set({
          message: 'Email verified successfully',
        })
      )
    } catch (e) {
      if ('status' in e) {
        next(e)
      } else {
        next(FailureResponse(500).set('Something went wrong!!!'))
      }
    }
  }

  static async verifyAccountExist(req, res, next) {
    try {
      const { email } = req.body
      await AuthService.verifyAccount(email)
      next(
        SuccessResponse(200).set({
          message: 'Account exist',
        })
      )
    } catch (e) {
      if ('status' in e) {
        next(e)
      } else {
        next(FailureResponse(500).set('Something went wrong!!!'))
      }
    }
  }

  static async resetPassword(req, res, next) {
    try {
      await AuthService.resetPassword(req.body)
      next(
        SuccessResponse(200).set({
          message: 'Reset link has been sent to your email.',
        })
      )
    } catch (e) {
      if ('status' in e) {
        next(e)
      } else {
        console.log(e)
        next(FailureResponse(500).set('Something went wrong!!!'))
      }
    }
  }
}

module.exports = AuthController
