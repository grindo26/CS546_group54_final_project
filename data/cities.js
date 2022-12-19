const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createCity = async (name, state, country, attractions, num_attractions, num_reviews) => {
    const cityCollection = await mongoCollections.cities();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    state = await helperFunc.execValdnAndTrim(state, "state");
    country = await helperFunc.execValdnAndTrim(country, "state");
    // await helperFunc.execValdnForArr(attractions, "attractions");
    //num_attractions = await helperFunc.execValdnAndTrim(num_attractions, "num_attractions");
    //num_reviews = await helperFunc.execValdnAndTrim(num_reviews, "num_reviews");

    // validation ends-----------------
    let newCity = {
        name: name,
        state: state,
        country: country,
        attractions: [],
        num_attractions: num_attractions,
        num_reviews: num_reviews,
    };

    const insertInfo = await cityCollection.insertOne(newCity);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a record into cities" };
    const newId = insertInfo.insertedId.toString();
    newCity._id = newId;
    const returnObj = Object.assign({ _id: newId }, newCity);
    return returnObj;
};

const getCityById = async (cityId) => {
    cityId = await helperFunc.execValdnAndTrim(cityId, "CityId");
    if (!ObjectId.isValid(cityId)) throw { statusCode: 400, message: "CityId is not a valid ObjectId" };
    const cityCollection = await mongoCollections.cities();
    const city = await cityCollection.findOne({ _id: ObjectId(cityId) });
    if (!city || city === null || city === undefined) {
        throw { statusCode: 404, message: "No city exists for this CityId" };
    }
    return city;
};

const checkCity = async (name, state) => {
    const cityCollection = await mongoCollections.cities();

    const checkReg = new RegExp(name, "i");
    const checkReg2 = new RegExp(state, "i");
    // const cityName = await cityCollection.findOne({name: {$regex: checkReg}}, {state: {$regex: state}});
    // const cityState = await cityCollection.findOne({state: {$regex: checkReg2}});
    const checkCity = await cityCollection.findOne({ name: { $regex: checkReg }, state: { $regex: checkReg2 } });
    if (checkCity == null) {
        return true;
    } else {
        return false;
    }
};

const getAllCities = async (num_cities) => {
    //if you need all cities, pass 0 in num_cities
    //if num_cities is not supplied, fetch 5 cities, otherwise fetch the num specified.
    if (num_cities === undefined || num_cities === null) {
        num_cities = 5;
    }
    if (isNaN(num_cities)) throw { statusCode: 400, message: `num_cities should be a positive whole number` };
    if (!/^\d+$/.test(num_cities)) throw { statusCode: 400, message: `num_cities should be a positive whole number` };
    if (parseInt(num_cities) < 0) throw { statusCode: 400, message: `num_cities should be a positive whole number` };
    if (num_cities > 2 ** 30 || num_cities < -(2 ** 30)) throw { statusCode: 400, message: "Number too high. Please change." };
    //limit has the range of 2^31 and -2^31
    const cityCollection = await mongoCollections.cities();
    const l_arrCities = await cityCollection
        .find({}, { projection: { _id: 1, attractions: 0 } })
        .sort({ num_attractions: -1, num_reviews: -1 })
        .limit(num_cities)
        .toArray();
    if (l_arrCities.length === 0) throw { statusCode: 400, message: "No cities in the database" };
    return l_arrCities;
};

const incrReviewCountInCityStats = async (cityId, incrField) => {
    cityId = await helperFunc.execValdnAndTrim(cityId, "CityId");
    if (!ObjectId.isValid(cityId)) throw { statusCode: 400, message: "CityId is not a valid ObjectId" };
    const cityCollection = await mongoCollections.cities();
    const updatedInfo = await cityCollection.updateOne({ _id: ObjectId(cityId) }, { $inc: { [incrField]: 1 } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

const addAttractionInCity = async (cityId, attractionId) => {
    cityId = await helperFunc.execValdnAndTrim(cityId, "CityId");
    if (!ObjectId.isValid(cityId)) throw { statusCode: 400, message: "CityId is not a valid ObjectId" };
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: "attractionId is not a valid ObjectId" };
    const cityCollection = await mongoCollections.cities();
    const updatedInfo = await cityCollection.updateOne(
        { _id: ObjectId(cityId) },
        { $inc: { num_attractions: 1 }, $push: { attractions: attractionId } }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

module.exports = {
    createCity,
    getCityById,
    checkCity,
    getAllCities,
    incrReviewCountInCityStats,
    addAttractionInCity,
};
