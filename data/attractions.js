const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createAttraction = async (name, cityId, reviews, rating, price, photo, location) => {
    const attrCollection = await mongoCollections.attractions();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    cityId = await helperFunc.execValdnAndTrim(cityId, "cityId");
    await helperFunc.execValdnForArr(reviews, "reviews");
    rating = await helperFunc.execValdnAndTrim(rating, "rating");
    price = await helperFunc.execValdnAndTrim(price, "price");
    photo = await helperFunc.execValdnAndTrim(photo, "photo");
    location = await helperFunc.execValdnAndTrim(location, "location");

    // validation ends-----------------
    let newAttraction = {
        name: name,
        cityId: cityId,
        reviews: reviews,
        rating: rating,
        price: price,
        photo: photo,
        location: location,
    };

    const insertInfo = await attrCollection.insertOne(newAttraction);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into attractions";
    const newId = insertInfo.insertedId.toString();
    newAttraction._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newAttraction);
    return returnObj;
};

module.exports = {
    createAttraction,
};
