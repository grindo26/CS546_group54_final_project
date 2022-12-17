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

module.exports = {
    createCity,getCityById,checkCity
};
