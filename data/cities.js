const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createCity = async (name, state, country, attractions, num_attractions, num_reviews) => {
    const cityCollection = await mongoCollections.cities();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    state = await helperFunc.execValdnAndTrim(state, "state");
    country = await helperFunc.execValdnAndTrim(country, "state");
    await helperFunc.execValdnForArr(attractions, "attractions");
    num_attractions = await helperFunc.execValdnAndTrim(num_attractions, "num_attractions");
    num_reviews = await helperFunc.execValdnAndTrim(num_reviews, "num_reviews");

    // validation ends-----------------
    let newCity = {
        name: name,
        state: state,
        country: country,
        attractions: attractions,
        num_attractions: num_attractions,
        num_reviews: num_reviews,
    };

    const insertInfo = await cityCollection.insertOne(newCity);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into cities";
    const newId = insertInfo.insertedId.toString();
    newCity._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newCity);
    return returnObj;
};




module.exports = {
    createCity
};
