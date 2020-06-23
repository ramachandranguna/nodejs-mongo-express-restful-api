'use strict'

const express = require('express')
const { login } = require('../validators/index')
const RequestValidator = require('../../../extensions/request.extension')

const router = express.Router()
const AuthController = require('../controllers/public.controller')

// Session.

router.post(
  '/local/login',
  [login, RequestValidator.validate],
  AuthController.loginLocal
)

module.exports = express.Router().use('/auth', router)
