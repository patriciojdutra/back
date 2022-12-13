function returnSuccess(data = {}, msg = "", status = 200){
    const json = { status: "success", message: msg, data: data}
     return [status, json]
}

function returnError(data, status = 200){
    try {
        const {code, message} = data
        const msg = code + ' - ' + message
        const json = { status: "error", message: msg, data: data}
        return [status, json]
    } catch (error) {
        return [500, "Ocorreu um erro interno! tente novamente mais tarde."]
    }
}

module.exports = {
    returnSuccess,
    returnError
}