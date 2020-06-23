'use strict'

const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema(
  {
    first_name: {
      lowercase: true,
      trim: true,
      required: true,
      type: String,
    },
    last_name: {
      lowercase: true,
      trim: true,
      type: String,
    },
    avatar_url_path: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    id: true,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
    toJSON: {
      getters: true,
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id
      },
    },
  }
)

mongoose.model('user', schema)

module.exports = schema
