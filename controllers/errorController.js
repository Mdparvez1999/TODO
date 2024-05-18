const AppError = require("../utils/appError");

// error handler
const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (err.name === "ValidationError") {
        err = handleValidationError(err)
    } else if (err.name === "CastError") {
        err = castHandleError(err);
    };

    errorResult(res, err);
};

//  handle validation error
const handleValidationError = (error) => {
    const message = error.details.map(err => err.message);
    return new AppError(400, message);
};

// handle cast error
const castHandleError = (error) => {
    return new AppError(400, `${error.value} is not a proper id`)
};

// error result
const errorResult = (res, error) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        return res.status(error.statusCode).json({
            status: false,
            message: "internal server error"
        });
    }
};

module.exports = errorController;
