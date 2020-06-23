/**
 * Created by sridharrajs.
 */

"use strict";

const jwt = require("jwt-simple");

const config = require("../../config");

function expiresIn(numDays) {
  const dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

class JWTController {
  static generateToken({ id }, type = "basic") {
    const expires = expiresIn(7);
    return jwt.encode(
      {
        exp: expires,
        id,
        type,
      },
      config.secret
    );
  }

  static decodeToken(token) {
    if (!token) {
      return null;
    }
    try {
      if (token.includes("Bearer ")) {
        // eslint-disable-next-line no-param-reassign
        token = token.replace("Bearer ", "");
      }
      return jwt.decode(token, config.secret);
    } catch (err) {
      console.log("err in decodeToken()::JWTController", err);
      return null;
    }
  }
}

module.exports = JWTController;
