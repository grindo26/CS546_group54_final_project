//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

moment = require("moment");

const validateInput = async (str, fieldName) => {
    if (str === undefined || str === null || str === "") throw `No parameter was passed in the ${fieldName} field of the function`;
    if (typeof str != "string") throw `${fieldName} is not a String`;
};

const validateStringLength = async (str, fieldName) => {
    if (!(str.length > 0)) throw `${fieldName} is not a valid string`;
};

const checkIfIdIsNum = async (str, fieldName) => {
    //NaN cannot handle '' string.. so ensure to handle empty string before
    if (isNaN(str)) throw `${fieldName} should be a positive whole number`;
    // check if string contains decimal
    if (!/^\d+$/.test(str)) throw `${fieldName} should be a positive whole number`;
    if (parseInt(str) <= 0) throw `${fieldName} should be a positive whole number`;
};

const execValdnAndTrim = async (str, fieldName) => {
    await validateInput(str, fieldName);
    str = str.trim();
    await validateStringLength(str, fieldName);
    return str;
};

const execValdnForArr = async (arr, fieldName) => {
    if (arr === undefined || arr === null || arr === "") throw `No parameter was passed in the ${fieldName} field of the function`;
    if (!Array.isArray(arr)) throw `${fieldName} must be an array.`;
    if (!arr.length > 0) throw `Length of ${fieldName} must be more than 0.`;
};

const isDateValid = async (str) => {
    return new Date(str) !== "Invalid Date" && !isNaN(new Date(str)) && moment(str, "MM/DD/YYYY", true).isValid();
};

const isUserLoggedIn = async (req) => {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

const isUserLoggedInReturnsLogin = async (req) => {
    if (req.session.user) {
        return true;
    } else {
        return res.status(400).render("userLogin");
    }
};

module.exports = {
    description: "This is the helper function for Lab 5 for CS-546",
    execValdnAndTrim,
    validateInput,
    validateStringLength,
    checkIfIdIsNum,
    execValdnForArr,
    isDateValid,
    isUserLoggedIn,
    isUserLoggedInReturnsLogin,
};
