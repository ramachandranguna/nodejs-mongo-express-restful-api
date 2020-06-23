/**
 * Created by sridharrajs on 1/6/16.
 */

"use strict";

const _ = require("lodash");

const ENVS = ["production", "development", "local", "stage"];

const EMAILS = {
  NOTIFICATIONS: "chairfill.com <notifications@mg.chairfill.com>",
  SUPPORT: "Chairfill Support<support@mg.chairfill.com>",
};

class Config {
  static isValidEnv(HOST_ENV) {
    return new Promise((resolve, reject) => {
      if (_.includes(ENVS, HOST_ENV)) {
        resolve("Success");
      } else {
        reject(new Error({ message: "Failed" }));
      }
    });
  }

  static isSecretSet(MY_SECRET) {
    return new Promise((resolve, reject) => {
      if (MY_SECRET) {
        resolve("Success");
      } else {
        reject(new Error({ message: "Set MY_SECRET in .env file" }));
      }
    });
  }

  static shouldSendEmail() {
    return process.env.SEND_EMAIL === "true";
  }

  static init() {
    this.port = process.env.PORT;
    this.secure = process.env.SECURE;
    this.mongodbUrl = process.env.MONGODB_URL;
    this.secret = process.env.MY_SECRET;
    this.sendgridApiKey = process.env.SENDGRID_API_KEY;
    this.MG_DOMAIN = process.env.MG_DOMAIN;
    this.MG_API_KEY = process.env.MG_API_KEY;
    this.EMAILS = EMAILS;
    this.WEBSITE_PORTAL_URL = process.env.WEBSITE_URL;
    this.OWNER_PORTAL_URL = process.env.OWNER_PORTAL_URL;
    this.ADMIN_PORTAL_URL = process.env.ADMIN_PORTAL_URL;
    this.IMAGE = {
      pk: process.env.IMAGE_PK_KEY,
      pb: process.env.IMAGE_PB_KEY,
      baseURL: process.env.IMAGE_BASE_URL,
    };
    return Promise.resolve("Success");
  }
}

module.exports = Config;
