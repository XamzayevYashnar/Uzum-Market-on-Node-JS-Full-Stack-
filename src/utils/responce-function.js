export function successFunction(res, data, message, status){
    return res.status(status).json({
        status: true,
        message: message,
        data: data
    })
}