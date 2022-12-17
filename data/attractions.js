const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const citiesData = require("../data/cities");

const createAttraction = async (name, cityId, reviews, rating, price, photo, location, tags = []) => {
    const attrCollection = await mongoCollections.attractions();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    cityId = await helperFunc.execValdnAndTrim(cityId, "cityId");
    reviews = [];
    rating = 0;
    price = await helperFunc.execValdnAndTrim(price, "price");
    await helperFunc.validatePriceRange(price);
    photo = await helperFunc.execValdnAndTrim(photo, "photo");
    // location = await helperFunc.execValdnAndTrim(location, "location");
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
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a record into attractions" };
    const newId = insertInfo.insertedId.toString();
    newAttraction._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newAttraction);
    //Now also update num_attractions in city page.
    const updateAttrRes = await citiesData.addAttractionInCity(cityId, returnObj._id);
    if (updateAttrRes) {
        return returnObj;
    }
};

const getAllAttraction = async (cityId) => {
    cityId = await helperFunc.execValdnAndTrim(cityId, "cityId");
    if (!ObjectId.isValid(cityId)) throw { statusCode: 400, message: "CityId is not a valid ObjectId" };
    const attrCollection = await mongoCollections.attractions();
    const attrList = await attrCollection.find({ cityId: cityId }).toArray();
    if (!attrList || attrList === null || attrList === undefined || attrList.length == 0)
        throw { statusCode: 404, message: "Could not get attractions for this city" };
    return attrList;
};

const getAttractionById = async (attractionId) => {
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: "attractionId is not a valid ObjectId" };
    const attractionCollection = await mongoCollections.attractions();
    const attractionList = await attractionCollection.findOne({ _id: ObjectId(attractionId) });
    if (!attractionList || attractionList === null || attractionList === undefined)
        throw { statusCode: 404, message: `No attraction exists with that id` };
    return attractionList;
};

const getPopularAttractions = async (num_attractions) => {
    if (num_attractions === undefined || num_attractions === null) {
        num_attractions = 5;
    }
    if (!(num_attractions > 0)) throw { statusCode: 400, message: `num_attractions is not a valid string` };
    if (isNaN(num_attractions)) throw { statusCode: 400, message: `num_attractions should be a positive whole number` };
    if (!/^\d+$/.test(num_attractions)) throw { statusCode: 400, message: `num_attractions should be a positive whole number` };
    if (parseInt(num_attractions) <= 0) throw { statusCode: 400, message: `num_attractions should be a positive whole number` };
    if (num_attractions > 2 ** 30 || num_attractions < -(2 ** 30)) throw { statusCode: 400, message: "Number too high. Please change." };
    //limit has the range of 2^31 and -2^31
    const attractionCollection = await mongoCollections.attractions();
    const l_arrAttractions = await attractionCollection
        .find({}, { projection: { _id: 1, reviews: 0 } })
        .sort({ rating: -1, price: 1 })
        .limit(num_attractions)
        .toArray();
    if (l_arrAttractions.length === 0) throw { statusCode: 404, message: "No attractions in the database" };
    return l_arrAttractions;
};

module.exports = {
    createAttraction,
    getAllAttraction,
    getAttractionById,
    getPopularAttractions,
};
