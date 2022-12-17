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
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into cities";
    const newId = insertInfo.insertedId.toString();
    newCity._id = newId;
    const returnObj = Object.assign({ _id: newId }, newCity);
    return returnObj;
};

const getCityById = async (cityId) => {
const cityCollection = await mongoCollections.cities();
const city = await cityCollection.findOne({_id: ObjectId(cityId)});
return city;

};

const checkCity = async (name, state) => { 

     const cityCollection = await mongoCollections.cities();

    const checkReg = new RegExp(name, "i")
    const checkReg2 = new RegExp(state, "i")
    // const cityName = await cityCollection.findOne({name: {$regex: checkReg}}, {state: {$regex: state}});
    // const cityState = await cityCollection.findOne({state: {$regex: checkReg2}});
    const checkCity = await cityCollection.findOne({name: {$regex: checkReg}, state: {$regex: checkReg2}});
    if(checkCity == null){ return true }
    else { return false}
      
};

const getAllCities = async (num_cities) => {
    //if num_cities is not supplied, fetch 5 cities, otherwise fetch the num specified.
    if (num_cities === undefined || str === null) {
        num_cities = 5;
    }
    if (!(num_cities > 0)) throw `num_cities is not a valid string`;
    if (isNaN(num_cities)) throw `num_cities should be a positive whole number`;
    if (!/^\d+$/.test(num_cities)) throw `num_cities should be a positive whole number`;
    if (parseInt(num_cities) <= 0) throw `num_cities should be a positive whole number`;
    if (num_cities > 2 ** 30 || num_cities < -(2 ** 30)) throw "Number too high. Please change.";
    //limit has the range of 2^31 and -2^31
    const cityCollection = await mongoCollections.cities();
    const l_arrCities = await cityCollection
        .find({}, { projection: { _id: 1, attractions: 0 } })
        .sort({ num_attractions: -1, num_reviews: -1 })
        .limit(num_cities)
        .toArray();
    if (l_arrCities.length === 0) throw "No cities in the database";
    return l_arrCities;
};

module.exports = {
    createCity,getCityById,checkCity, getAllCities
};




