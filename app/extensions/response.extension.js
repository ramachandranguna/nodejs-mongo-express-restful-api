/**
 * Created by ramachandrang.
 */

const SuccessResponse = status => {
  return {
    set: data => ({
      status,
      data,
    }),
  }
}

const FailureResponse = status => {
  return {
    set: data => ({
      status,
      data: {
        message: data,
      },
    }),
  }
}

const ValidationResponse = status => {
  return {
    set: data => ({
      status,
      data: {
        errors: data,
      },
    }),
  }
}

module.exports = {
  SuccessResponse,
  FailureResponse,
  ValidationResponse,
}
