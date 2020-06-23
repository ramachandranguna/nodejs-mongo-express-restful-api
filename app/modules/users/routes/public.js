'use strict'

const express = require('express')

const router = express.Router()
const { register } = require('../validators')
const RequestValidator = require('../../../extensions/request.extension')

const PublicController = require('../controllers/public.controller')

router.post(
  '/local/register',
  [register, RequestValidator.validate],
  PublicController.createLocal
)

module.exports = express.Router().use('/users', router)
