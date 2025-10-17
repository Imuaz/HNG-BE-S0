class ApiError extends Error {
  /**
   * @param {string} code - machine-readable error code
   * @param {string} message - human readable message
   * @param {number} httpStatus - suggested HTTP status code
   */
  constructor(code, message, httpStatus = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.httpStatus = httpStatus;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
