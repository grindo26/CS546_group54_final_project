const mongoCollections = require("../config/mongoCollections");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

const searchCity = async (searchString) => {
    searchString = await helperFunc.execValdnAndTrim(searchString, "searchbar");
    await helperFunc.isNameValid(searchString, "searchbar");
    const cityCollection = await mongoCollections.cities();
    const checkReg = new RegExp(searchString, "i");
    const checkCity = await cityCollection
        .find({ name: { $regex: searchString, $options: "$i" } }, { projection: { _id: 1, name: 1, state: 1, country: 1, num_attractions: 1 } })
        .toArray();
        // if(checkCity.length == 0) {
        //     throw { statusCode: 400, message: `Couldn't find the City you are looking for`}
        // }
    return checkCity;
};

const searchAttraction = async (searchString) => {
    searchString = await helperFunc.execValdnAndTrim(searchString, "Search String");
    await helperFunc.isNameValid(searchString, "Search String");
    const attrCollection = await mongoCollections.attractions();
    const checkReg = new RegExp(searchString, "i");
    const checkAttraction = await attrCollection
        .find({ name: { $regex: searchString, $options: "$i" } }, { projection: { _id: 1, name: 1, rating: 1, price: 1 } })
        .toArray();
        // if(checkAttraction.length == 0) {
        //     throw { statusCode: 400, message: `Couldn't find the Attraction you are looking for`}
        // }
    return checkAttraction;
};

module.exports = {
    searchCity,
    searchAttraction,
};
