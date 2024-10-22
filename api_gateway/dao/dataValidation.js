const THRESHOLD_VALUES = require('../common/globals').THRESHOLD_VALUES;

function checkNumericValues(parameter, value) {
    return (typeof(value) == "number") && value >= THRESHOLD_VALUES[parameter].min && value <= THRESHOLD_VALUES[parameter].max;
}

function checkString (value) {
    return typeof(value) == "string" && value.trim().length > 0;
}

module.exports = {checkNumericValues, checkString};