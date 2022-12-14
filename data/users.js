const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const attractionData = require("../data/attractions");

const getUserFromUsername = async (username) => {
    username = await helperFunc.execValdnAndTrim(username, "username");
    await helperFunc.isUsernameValid(username, "username");
    const usersCollection = await mongoCollections.users();
    const nameRegex = new RegExp(username, "i");
    const checkUsername = await usersCollection.find({ username: { $regex: nameRegex } }).toArray();
    return checkUsername;
};

const getUserFromEmail = async (email) => {
    email = await helperFunc.execValdnAndTrim(email, "email");
    await helperFunc.isEmailValid(email, "Email");
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
    if (checkIfUsernameExists.length != 0) throw { statusCode: 400, message: "username already exists. Pick another username" };

    let checkIfEmailExists = await getUserFromEmail(email);
    if (checkIfEmailExists.length != 0) throw { statusCode: 400, message: "email already exists" };

    await helperFunc.isNameValid(newUser.name, "name");
    await helperFunc.isUsernameValid(newUser.username, "username");
    await helperFunc.isAgeValid(newUser.age, "age");
    await helperFunc.isEmailValid(newUser.email, "email");
    await helperFunc.isPasswordValid(newUser.password, "password");

    const saltRounds = 10;
    newUser.password = await bcrypt.hash(password, saltRounds);

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a record into users" };
    const newId = insertInfo.insertedId.toString();
    newUser._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newUser);
    return returnObj;
};

const checkUser = async (username, password) => {
    username = await helperFunc.execValdnAndTrim(username, "username");
    password = await helperFunc.execValdnAndTrim(password, "password");
    await helperFunc.isUsernameValid(username, "username");
    await helperFunc.isPasswordValid(password, "password");
    const userCollection = await mongoCollections.users();
    let usernameRegex = new RegExp(username, "i");
    const userObj = await userCollection.findOne({ username: { $regex: usernameRegex } });
    if (!userObj || userObj === null || userObj === undefined) throw { statusCode: 400, message: "Either the username or password is invalid" };
    let comparePassword = await bcrypt.compare(password, userObj.password);
    if (comparePassword) {
        return { authenticatedUser: true, userId: userObj._id };
    } else {
        throw { statusCode: 400, message: "Either the username or password is invalid" };
    }
};

const addAttractionIntoUsers = async (attractionId, userId) => {
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    if (!ObjectId.isValid(attractionId)) {
        throw { statusCode: 400, message: "Invalid attractionId" };
    }
    if (!ObjectId.isValid(userId)) {
        throw { statusCode: 400, message: "Invalid userID." };
    }
    let userObj = await getUserFromUserId(userId);
    if (!userObj || userObj === null || userObj === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    const userCollection = await mongoCollections.users();
    const updatedInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { attractions: attractionId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

const deleteAttractionFromUsers = async (attractionId, userId) => {
    userId = await helperFunc.execValdnAndTrim(userId, "attractionId");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "userId is not a valid ObjectId" };
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: "attractionId is not a valid ObjectId" };
    let attractionObj = await attractionData.getAttractionById(attractionId);
    if (!attractionObj || attractionObj === null || attractionObj === undefined) {
        throw { statusCode: 404, message: "No attration exists for this attractionObj" };
    }
    const attractionCollection = await mongoCollections.attractions();
    const updatedInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId), $pull: { attractions: attractionId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

const addReviewInUsers = async (reviewId, userId) => {
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    if (!ObjectId.isValid(reviewId)) {
        throw { statusCode: 400, message: "Invalid reviewId" };
    }
    if (!ObjectId.isValid(userId)) {
        throw { statusCode: 400, message: "Invalid userID." };
    }
    let userObj = await getUserFromUserId(userId);
    if (!userObj || userObj === null || userObj === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    const userCollection = await mongoCollections.users();
    const updatedInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { reviews: reviewId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the user for this operation. Try again later` };
    }
    return true;
};

const removeReviewFromUsers = async (reviewId, userId) => {
    userId = await helperFunc.execValdnAndTrim(userId, "attractionId");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "userId is not a valid ObjectId" };
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "reviewId is not a valid ObjectId" };
    let userObj = await getUserFromUserId(userId);
    if (!userObj || userObj === null || userObj === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    const userCollection = await mongoCollections.users();
    const updatedInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $pull: { reviews: reviewId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the user for this operation. Try again later` };
    }
    return true;
};
const addCommentInUsers = async (commentId, userId) => {
    commentId = await helperFunc.execValdnAndTrim(commentId, "commentId");
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    if (!ObjectId.isValid(commentId)) {
        throw { statusCode: 400, message: "Invalid commentId" };
    }
    if (!ObjectId.isValid(userId)) {
        throw { statusCode: 400, message: "Invalid userID." };
    }
    let userObj = await getUserFromUserId(userId);
    if (!userObj || userObj === null || userObj === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    const userCollection = await mongoCollections.users();
    const updatedInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $push: { comments: commentId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the user for this operation. Try again later` };
    }
    return true;
};

const removeCommentFromUsers = async (commentId, userId) => {
    userId = await helperFunc.execValdnAndTrim(userId, "user Id");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "userId is not a valid ObjectId" };
    commentId = await helperFunc.execValdnAndTrim(commentId, "commentId");
    if (!ObjectId.isValid(commentId)) throw { statusCode: 400, message: "commentId is not a valid ObjectId" };
    let userObj = await getUserFromUserId(userId);
    if (!userObj || userObj === null || userObj === undefined) {
        throw { statusCode: 400, message: "No user exists with this id" };
    }
    const userCollection = await mongoCollections.users();
    const updatedInfo = await userCollection.updateOne({ _id: ObjectId(userId) }, { $pull: { comments: commentId } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the user for this operation. Try again later` };
    }
    return true;
};

module.exports = {
    createUser,
    checkUser,
    getUserFromUserId,
    getUserFromUsername,
    getUserFromEmail,
    addAttractionIntoUsers,
    deleteAttractionFromUsers,
    addReviewInUsers,
    removeReviewFromUsers,
    addCommentInUsers,
    removeCommentFromUsers,
};
