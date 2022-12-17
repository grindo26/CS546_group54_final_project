moment = require("moment");

const validateInput = async (str, fieldName) => {
    if (str === undefined || str === null || str === "")
        throw { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function` };
    if (typeof str != "string") throw { statusCode: 400, message: `${fieldName} is not a String` };
};

const validateStringLength = async (str, fieldName) => {
    if (!(str.length > 0)) throw { statusCode: 400, message: `${fieldName} is not a valid string` };
};

const checkIfIdIsNum = async (str, fieldName) => {
    //NaN cannot handle '' string.. so ensure to handle empty string before
    if (isNaN(str)) throw { statusCode: 400, message: `${fieldName} should be a positive whole number` };
    // check if string contains decimal
    if (!/^\d+$/.test(str)) throw { statusCode: 400, message: `${fieldName} should be a positive whole number` };
    if (parseInt(str) <= 0) throw { statusCode: 400, message: `${fieldName} should be a positive whole number` };
};

const execValdnAndTrim = async (str, fieldName) => {
    await validateInput(str, fieldName);
    str = str.trim();
    await validateStringLength(str, fieldName);
    return str;
};

const execValdnForArr = async (arr, fieldName) => {
    if (arr === undefined || arr === null || arr === "")
        throw { statusCode: 400, message: `No parameter was passed in the ${fieldName} field of the function` };
    if (!Array.isArray(arr)) throw { statusCode: 400, message: `${fieldName} must be an array.` };
    if (!arr.length > 0) throw { statusCode: 400, message: `Length of ${fieldName} must be more than 0.` };
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
        return res.status(200).render("userLogin");
    }
};

const isNameValid = async (name, fieldName) => {
    if (name.trim().length < 3) throw { statusCode: 400, message: `${fieldName} should atleast have 3 characters` };
    if (!/^[a-z ,.'-]+$/.test(name)) throw { statusCode: 400, message: `${fieldName} contains invalid characters` };
};

const isAgeValid = async (age, fieldName) => {
    if (isNaN(age)) {
        throw { statusCode: 400, message: `${fieldName} Age should be a number` };
    } else {
        if (age < 14) throw { statusCode: 400, message: ` user must be 14 or older` };
    }
};

const isEmailValid = async (email, fieldName) => {
    let emailConstraints = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
    if (!email.match(emailConstraints)) throw { statusCode: 400, message: `${fieldName} is invalid. Please enter a valid ${fieldName}` };
};

const isUsernameValid = async (username, fieldName) => {
    let usernameAlphaNumCheck = /^[A-Za-z0-9]+$/;
    if (!username.match(usernameAlphaNumCheck)) throw { statusCode: 400, message: `${fieldName} should be alpha-numeric` };
    else if (/\s/.test(username)) throw { statusCode: 400, message: `${fieldName} should not contain empty spaces` };
    else if (username.trim().length < 4) throw { statusCode: 400, message: `${fieldName} should have more than 4 characters` };
};

const isPasswordValid = async (password, fieldName) => {
    let passwordCheck = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/;
    if (!password.match(passwordCheck))
        throw { statusCode: 400, message: `${fieldName} should have atleast 1 Uppercase letter, 1 number and 1 special character` };
    else if (/\s/.test(password)) throw { statusCode: 400, message: `${fieldName} should not contain empty spaces` };
    else if (password.trim().length < 6) throw { statusCode: 400, message: `${fieldName} should have more than 6 characters` };
};

const validateRating = async (rating) => {
    if (isNaN(rating)) throw { statusCode: 400, message: `Rating should be a positive whole number` };
    if (parseFloat(rating) <= 1 && parseFloat(rating) > 5) throw { statusCode: 400, message: `Rating should be a positive number between 1-5` };
    return parseFloat(rating).toFixed(1);
};

module.exports = {
    description: "This is the helper function",
    execValdnAndTrim,
    validateInput,
    validateStringLength,
    checkIfIdIsNum,
    execValdnForArr,
    isDateValid,
    isUserLoggedIn,
    isUserLoggedInReturnsLogin,
    isNameValid,
    isAgeValid,
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
    validateRating,
};
