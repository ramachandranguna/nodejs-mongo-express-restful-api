'use strict'

const mongoose = require('mongoose')

const { Schema } = mongoose
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')

const accountSchema = new Schema(
  {
    type: {
      trim: true,
      enum: ['local', 'facebook', 'google', 'twitter', 'github'], //Login Type default to "local"
      type: String,
    },
    hash: {
      trim: true,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const schema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    first_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    verification_token: {
      type: String,
      default: crypto.randomBytes(20).toString('hex'),
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    is_force_change_password: {
      type: Boolean,
      default: true,
    },
    reset_token: {
      type: String,
      index: crypto.randomBytes(20).toString('hex'),
    },
    account: [accountSchema],
    reference_id: {
      type: mongoose.Types.ObjectId,
      refPath: 'type',
    },
    type: {
      type: String,
      required: true,
      enum: ['user'], //User Model
      //In future, you could get another set of users like storeOwners. The auth is seperated into a module to isolate the common functionality.
    },
    email_alias: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)
schema.index(
  {
    email: 1,
  },
  {
    unique: true,
  }
)
schema.index(
  {
    email_alias: 1,
  },
  {
    unique: true,
  }
)
schema.index(
  {
    reference_id: 1,
  },
  {
    unique: true,
  }
)
schema.index({
  verification_token: 1,
})

schema.methods.validatePassword = async function validatePassword(data, cb) {
  const localAccountIndex = this.account.findIndex(x => x.type === 'local')
  try {
    if (localAccountIndex !== -1) {
      bcrypt.compare(data, this.account[localAccountIndex].hash, cb)
    } else {
      cb(true, null)
    }
  } catch (e) {
    cb(true, e)
  }
}

mongoose.model('auth', schema)
