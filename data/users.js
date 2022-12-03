const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createUser = async (name, username, email, age, password, attractions, reviews, comments) => {
    const userCollection = await mongoCollections.users();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    username = await helperFunc.execValdnAndTrim(username, "username");
    email = await helperFunc.execValdnAndTrim(email, "email");
    age = await helperFunc.execValdnAndTrim(age, "age");
    password = await helperFunc.execValdnAndTrim(password, "password");
    await helperFunc.execValdnForArr(attractions, "attractions");
    await helperFunc.execValdnForArr(reviews, "reviews");
    await helperFunc.execValdnForArr(comments, "comments");

    // validation ends-----------------
    let newUser = {
        name: name,
        username: username,
        email: email,
        age: age,
        password: password,
        attractions: attractions,
        reviews: reviews,
        comments: comments,
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into users";
    const newId = insertInfo.insertedId.toString();
    newUser._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newUser);
    return returnObj;
};

module.exports = {
    createUser,
};
