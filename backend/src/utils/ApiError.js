class ApiError extends Error {
    constructor(statusCode, message, code = undefined, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true; // expected error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;