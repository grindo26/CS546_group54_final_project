const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const getUserFromUsername = async (username) => {
    const usersCollection = await mongoCollections.users();
    const nameRegex = new RegExp(username, "i");
    const checkUsername = await usersCollection.find({ username: { $regex: nameRegex } }).toArray();
    return checkUsername;
};

const getUserFromEmail = async (email) => {
    const usersCollection = await mongoCollections.users();
    const nameRegex = new RegExp(email, "i");
    const checkEmail = await usersCollection.find({ email: { $regex: nameRegex } }).toArray();
    return checkEmail;
};

const getUserFromUserId = async (id) => {
    id = await helperFunc.execValdnAndTrim(id, "userId");
    if (!ObjectId.isValid(id)) throw { statusCode: 400, message: `userId provided is not a valid ObjectId` };
    const usersCollection = await mongoCollections.users();
    const l_objUser = await usersCollection.findOne({ _id: ObjectId(id) });
    if (!l_objUser || l_objUser === null || l_objUser === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    return l_objUser;
};

const createUser = async (name, username, email, age, password) => {
    const userCollection = await mongoCollections.users();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    username = await helperFunc.execValdnAndTrim(username, "username");
    email = await helperFunc.execValdnAndTrim(email, "email");
    age = await helperFunc.execValdnAndTrim(age, "age");
    password = await helperFunc.execValdnAndTrim(password, "password");
    // await helperFunc.execValdnForArr(attractions, "attractions");
    // await helperFunc.execValdnForArr(reviews, "reviews");
    // await helperFunc.execValdnForArr(comments, "comments");

    let newUser = {
        name: name,
        username: username,
        email: email,
        age: age,
        password: password,
        attractions: [],
        reviews: [],
        comments: [],
    };

    let checkIfUsernameExists = await getUserFromUsername(username);
    if (checkIfUsernameExists.length != 0) throw "username already exists. Pick another username";

    let checkIfEmailExists = await getUserFromEmail(email);
    if (checkIfEmailExists.length != 0) throw "email already exists";

    await helperFunc.isNameValid(newUser.name, "name");
    await helperFunc.isUsernameValid(newUser.username, "username");
    await helperFunc.isAgeValid(newUser.age, "age");
    await helperFunc.isEmailValid(newUser.email, "email");
    await helperFunc.isPasswordValid(newUser.password, "password");

    const saltRounds = 10;
    newUser.password = await bcrypt.hash(password, saltRounds);

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into users";
    const newId = insertInfo.insertedId.toString();
    newUser._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newUser);
    return returnObj;
};

const checkUser = async (username, password) => {
    if (typeof username == "undefined") throw "Please enter the username";
    if (typeof password == "undefined") throw "Please enter the password";
    if (typeof username != "string") throw "username must be a string";
    if (typeof password != "string") throw "password must be a string";
    if (username.trim().length < 4) throw "username should have more than 4 characters";
    if (password.trim().length < 6) throw "passwored should have more than 6 characters";
    if (/\s/.test(username) || /\s/.test(password)) throw "username & password cannot have empty spaces";
    if (username.trim().length === 0 || password.trim().length === 0) throw "username or password cannot be empty spaces";

    username = username.toLowerCase();

    let alphaNum = /^[A-Za-z0-9]+$/;
    if (!username.match(alphaNum)) throw "username can only be alpha-numeric";

    let passwordConstaints = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/;

    if (!password.match(passwordConstaints))
        throw "password should contain atleast an uppercase letter, a special character and a number and should be minimum 6 characters long";

    const userCollection = await mongoCollections.users();
    const usernameFound = await userCollection.findOne({ username: username });

    if (!usernameFound) throw "Either the username or password is invalid";

    if (usernameFound) {
        comparePassword = await bcrypt.compare(password, usernameFound.password);
    }

    if (comparePassword) {
        return { authenticatedUser: true };
    } else {
        throw "Either the username or password is invalid";
    }
};

module.exports = {
    createUser,
    checkUser,
    getUserFromUserId,
};
