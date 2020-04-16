const DEBUG = false;

function logDebug(text,obj) {
    DEBUG && console.log(text, obj);
}

module.exports = {
    logDebug
}
