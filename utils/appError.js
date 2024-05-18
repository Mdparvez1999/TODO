class AppError extends Error {
    constructor(statusCode, message, status = false, isOperational = true) {
        super(message);

        this.message = message;

        this.statusCode = statusCode;

        this.status = status;

        this.isOperational = isOperational;
    }
};

module.exports = AppError;