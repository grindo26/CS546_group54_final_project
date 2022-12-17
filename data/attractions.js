const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createAttraction = async (name, cityId, reviews, rating, price, photo, location, tags = []) => {
    const attrCollection = await mongoCollections.attractions();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    cityId = await helperFunc.execValdnAndTrim(cityId, "cityId");
    // await helperFunc.execValdnForArr(reviews, "reviews");
    // rating = await helperFunc.execValdnAndTrim(rating, "rating");
    price = await helperFunc.execValdnAndTrim(price, "price");
    // photo = await helperFunc.execValdnAndTrim(photo, "photo");
    location = await helperFunc.execValdnAndTrim(location, "location");
    if (tags.length != 0) {
        await helperFunc.execValdnForArr(tags, "tags");
    }
    const imageBuffer = Buffer.from(photo, "binary").toString("base64");

    // validation ends-----------------
    let newAttraction = {
        name: name,
        cityId: cityId,
        reviews: reviews,
        rating: rating,
        price: price,
        photo: imageBuffer,
        location: location,
        tags: tags,
    };

    const insertInfo = await attrCollection.insertOne(newAttraction);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into attractions";
    const newId = insertInfo.insertedId.toString();
    newAttraction._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newAttraction);
    return returnObj;
};

const getAllAttraction = async (cityId) => {
    // if (!movieId) throw 'You must provide an movieId to search for';
    // if (typeof movieId !== 'string') throw 'movieId must be a string';
    // if (movieId.trim().length === 0)
    //   throw 'movieId cannot be an empty string or just spaces';
    // movieId = movieId.trim();
    // if (!ObjectId.isValid(movieId)) throw 'invalid object ID';

    const attrCollection = await mongoCollections.attractions();
    //    console.log(cityId)
    const attrList = await attrCollection.find({ cityId: cityId }).toArray();
    return attrList;
};

const getAttractionById = async (attractionId) => {
    console.log(attractionId);
    //   newId = await helperFunc.execValdnAndTrim(attractionId, "Attraction ID");

    const attractionCollection = await mongoCollections.attractions();
    const attractionList = await attractionCollection.findOne({ _id: ObjectId(attractionId) });
    if (!attractionList) throw { statusCode: 404, message: `No attraction exists with that id` };
    return attractionList;
};

const getPopularAttractions = async (num_attractions) => {
    if (num_attractions === undefined || num_attractions === null) {
        num_attractions = 5;
    }
    if (!(num_attractions > 0)) throw `num_attractions is not a valid string`;
    if (isNaN(num_attractions)) throw `num_attractions should be a positive whole number`;
    if (!/^\d+$/.test(num_attractions)) throw `num_attractions should be a positive whole number`;
    if (parseInt(num_attractions) <= 0) throw `num_attractions should be a positive whole number`;
    if (num_attractions > 2 ** 30 || num_attractions < -(2 ** 30)) throw "Number too high. Please change.";
    //limit has the range of 2^31 and -2^31
    const attractionCollection = await mongoCollections.attractions();
    const l_arrAttractions = await attractionCollection
        .find({}, { projection: { _id: 1, reviews: 0 } })
        .sort({ rating: -1, price: 1 })
        .limit(num_attractions)
        .toArray();
    if (l_arrAttractions.length === 0) throw "No attractions in the database";
    return l_arrAttractions;
};

module.exports = {
    createAttraction,
    getAllAttraction,
    getAttractionById,
    getPopularAttractions,
};
