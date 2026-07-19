export function globalErrorHandler(error, req ,res, next){
    const obj = {
        statusCode: error.status ? error.status : 500,
        message: error.message ? error.message : "Internal server errror"
    }
    return res.status(obj.statusCode).json({
        message: obj.message
    })
};
