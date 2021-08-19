const mongoose = require('mongoose')

const Auth = mongoose.model('auth')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const _ = require('lodash')
const { FailureResponse } = require('../../../extensions/response.extension')
const JWTController = require('../../../extensions/jwt.extension')

class AuthService extends JWTController {
  static returnToken(auth) {
    return {
      session: {
        is_email_verified: auth.is_email_verified,
        id: auth.reference_id,
        type: auth.type,
        is_force_change_password: auth.is_force_change_password,
      },
      token: super.generateToken({ id: auth.reference_id }, auth.type),
    }
  }

  static async delete(_id) {
    await Auth.findByIdAndDelete(_id)
      .lean()
      .exec()
  }

  static async create(
    {
      email,
      password,
      email_alias: emailAlias,
      reference_id: referenceId,
      first_name: firstName,
      last_name: lastName,
    },
    type = 'user'
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync())
        console.log(hash)
        const auth = await new Auth({
          reference_id: referenceId,
          email,
          first_name: firstName,
          last_name: lastName,
          account: [
            {
              type: 'local',
              hash,
            },
          ],
          type,
          email_alias: emailAlias,
        }).save()

        // AccountCreatedEvent.emit(
        //   'send-verification-on-register',
        //   firstName,
        //   auth
        // )

        resolve(auth)
      } catch (e) {
        console.log(e)
        reject(new Error(e))
      }
    })
  }

  static async verify(verificationToken) {
    const user = await Auth.findOne({
      verification_token: verificationToken,
      is_email_verified: false,
    })
    if (!user) {
      return Promise.reject(FailureResponse(404).set('Record not found.'))
    }
    user.is_email_verified = true
    return user.save()
  }

  static async resetPassword({ email }) {
    const user = await Auth.findOne({
      email,
    }).populate('reference_id')
    if (!user) {
      return Promise.reject(FailureResponse(404).set('Record not found.'))
    }
    user.reset_token = crypto.randomBytes(20).toString('hex')
    return user.save().then(res => {
      // ResetPasswordLink.emit(
      //   'reset-password-for-user',
      //   user.reference_id.first_name,
      //   user
      // )

      return Promise.resolve()
    })
  }

  static async changePasswordWithToken(resetToken, { password }) {
    const user = await Auth.findOne({
      reset_token: resetToken,
    }).populate('reference_id')
    if (!user) {
      return Promise.reject(FailureResponse(404).set('Record not found.'))
    }
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync())
    const localAccountIndex = _.findIndex(user.account, x => x.type === 'local')
    if (localAccountIndex !== -1) {
      user.account[localAccountIndex].hash = hash
    } else {
      user.account.push({
        type: 'local',
        hash,
      })
    }
    user.reset_token = ''
    return user.save().then(res => {
      // TODO Password mail not done.
      // AfterPasswordReset.emit(
      //   'set-password-success-with-token',
      //   user.reference_id.first_name,
      //   user
      // )
      return Promise.resolve()
    })
  }

  static async changePassword(_id, { password }) {
    const user = await Auth.findOne({
      reference_id: _id,
    }).populate('reference_id')
    if (!user) {
      return Promise.reject(FailureResponse(404).set('Record not found.'))
    }
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync())
    const localAccountIndex = _.findIndex(user.account, x => x.type === 'local')
    if (localAccountIndex !== -1) {
      user.account[localAccountIndex].hash = hash
    } else {
      user.account.push({
        type: 'local',
        hash,
      })
    }
    user.reset_token = ''
    return user.save().then(res => {
      // TODO Password mail not done.
      // AfterPasswordReset.emit(
      //   'set-password-success-with-token',
      //   user.reference_id.first_name,
      //   user
      // )
      return Promise.resolve()
    })
  }

  static async login({ email, password, type }) {
    const user = await Auth.findOne({
      email,
    }).exec()
    if (!user) {
      return Promise.reject(FailureResponse(401).set('Unauthenticated'))
    }
    return new Promise((resolve, reject) => {
      user.validatePassword(password, (_err, success) => {
        if (success) {
          resolve(user.toJSON())
        } else {
          reject(FailureResponse(401).set('Unauthenticated'))
        }
      })
    })
  }
}

module.exports = AuthService
