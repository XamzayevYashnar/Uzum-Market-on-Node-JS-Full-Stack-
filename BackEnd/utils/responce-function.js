export function successFunction(res, data, message, status){
    return res.status(status).json({
        message: message,
        data: data
    })
}