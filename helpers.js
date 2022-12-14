const e = require("express");

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

const isUserLoggedIn = async(req) => {
    
    if(req.session.user) {
        return true;
    }else{
        return false;
    }
}

const isUserLoggedInReturnsLogin = async(req) => {
    
    if(req.session.user) {
        return true;
    }else{
        return res.status(400).render('userLogin');
    }
}

const isNameValid = async(name) => {
    
    
    if(name.trim().length < 3) throw "name should atleast have 3 characters"
}

const isAgeValid = async(age) => {

    if(isNaN(age)) {
        throw "Age should be a number"
    }else{
        if(age<9) throw "user must be above 9 years old"
    }

}

const isEmailValid = async(email) => {
    
  let emailConstraints = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/
  if(!email.match(emailConstraints)) throw "please enter a valid email"
}

const isUsernameValid= async(username) => {
    
    let usernameAlphaNumCheck= /^[A-Za-z0-9]+$/
    if(!username.match(usernameAlphaNumCheck)) throw "username should be alpha-numeric"
    else if(/\s/.test(username)) throw "username should not contain empty spaces"
    else if(username.trim().length < 4) throw "username should have more than 4 characters"
  }

const isPasswordValid = async(password) => {
    
    let passwordCheck = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/
    if(!password.match(passwordCheck)) throw "password should have atleast 1 Uppercase letter, 1 number and 1 special character"
    else if(/\s/.test(password)) throw "password should not contain empty spaces"
    else if(password.trim().length < 6) throw "password should have more than 6 characters"
  }

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
    isPasswordValid
};
