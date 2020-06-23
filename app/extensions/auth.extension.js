/**
 * Created by ramachandrang.
 */

'use strict'

const mongoose = require('mongoose')
const jwtController = require('./jwt.extension')

const Auth = mongoose.model('auth')

const appendAuth = async (req, res, next) => {
  const token = req.headers.authorization
  const auth = jwtController.decodeToken(token)
  req.auth = auth
  return next()
}

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization
  const auth = jwtController.decodeToken(token)
  if (!auth) {
    return res.status(401).send({
      message: 'Unauthenticated',
    })
  }
  if (
    auth.type !== 'admin' &&
    (await Auth.countDocuments({ reference_id: auth.id })) === 0
  ) {
    return res.status(401).send({
      message: 'Unauthenticated',
    })
  }
  req.auth = auth
  return next()
}

const isBasic = (req, res, next) => {
  const { auth } = req
  if (!auth) {
    return res.status(401).send({
      message: 'Unauthenticated',
    })
  }
  return auth.type === 'user'
    ? next()
    : res.status(403).send({
        message: 'Forbidden',
      })
}

const isOwner = (req, res, next) => {
  const { auth } = req
  if (!auth) {
    return res.status(401).send({
      message: 'Unauthenticated',
    })
  }
  return auth.type === 'owner'
    ? next()
    : res.status(403).send({
        message: 'Forbidden',
      })
}

const isAdmin = (req, res, next) => {
  const { auth } = req
  if (!auth) {
    return res.status(401).send({
      message: 'Unauthenticated',
    })
  }
  return auth.type === 'admin'
    ? next()
    : res.status(403).send({
        message: 'Forbidden',
      })
}

module.exports = {
  authenticate,
  isBasic,
  isAdmin,
  isOwner,
  appendAuth,
}
