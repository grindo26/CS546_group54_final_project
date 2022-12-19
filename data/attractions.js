const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const citiesData = require("../data/cities");
const usersDataCode = require("../data/users");

const updateOverallRating_add = async (p_numOvrRating, p_numRating, p_numElements) => {
    p_returnOvrRating = parseFloat((p_numOvrRating + (p_numRating - p_numOvrRating) / p_numElements).toFixed(1));
    return p_returnOvrRating;
};

const updateOverallRating_remove = async (p_numOvrRating, p_numRating, p_numElements) => {
    p_returnOvrRating = parseFloat(((p_numOvrRating * (p_numElements + 1) - p_numRating) / p_numElements).toFixed(1));
    return p_returnOvrRating;
};

const createAttraction = async (name, cityId, reviews, rating, price, photo, location, tags = [], userId) => {
    const attrCollection = await mongoCollections.attractions();
    //validate and update all params
    name = await helperFunc.execValdnAndTrim(name, "name");
    cityId = await helperFunc.execValdnAndTrim(cityId, "cityId");
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    if (!ObjectId.isValid(userId)) {
        throw { statusCode: 400, message: "UserId is not valid" };
    }
    reviews = [];
    rating = 0;
    price = await helperFunc.execValdnAndTrim(price, "price");
    await helperFunc.validatePriceRange(price);
    // location = await helperFunc.execValdnAndTrim(location, "location");
    tags = await helperFunc.execValdnAndTrim(tags, "tags");

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
        creatorId: userId,
    };

    const insertInfo = await attrCollection.insertOne(newAttraction);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a record into attractions" };
    const newId = insertInfo.insertedId.toString();
    newAttraction._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newAttraction);
    //Now also update num_attractions in city page.
    const updateAttrRes = await citiesData.addAttractionInCity(cityId, returnObj._id);
    // const userUpdateRes = await usersDataCode.addAttractionIntoUsers(returnObj._id, userId);

    if (updateAttrRes) {
        return returnObj;
    } else throw { statusCode: 500, message: "Some error occurred. Try again later" };
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

const getAttractionsfromAttractionIdArr = async (attrIdArr) => {
    const arr = [];
    for (i = 0; i < attrIdArr.length; i++) {
        let b = ObjectId(attrIdArr[i]);
        arr.push(b);
    }

    const attractionsCollection = await mongoCollections.attractions();
    const attractionsArr = await attractionsCollection.find({ _id: { $in: arr } }, { projection: { _id: 1, name: 1 } }).toArray();
    return attractionsArr;
};

const deleteAttraction = async (id, userId) => {
    id = await helperFunc.execValdnAndTrim(id, "Attraction ID");
    if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Attraction id provided is not a valid id." };
    const attractionCollection = await mongoCollections.attractions();
    const attractionObj = await getAttractionById(id);
    const cityId = attractionObj.cityId;
    if (attractionObj.reviews.length > 0) {
        throw { statusCode: 400, message: "Cannot delete this attraction. People have reviewed this attraction so you can't delete it." };
    }
    if (attractionObj.creatorId != userId) {
        throw { statusCode: 400, message: "Cannot delete this attraction. You are not the creator" };
    }
    const attractionRemovedFromCity = await citiesData.deleteAttractionFromCity(cityId, id);
    const attractionRemovedFromUsers = await usersDataCode.deleteAttractionFromUsers(cityId, userId);
    if (attractionRemovedFromCity && attractionRemovedFromUsers) {
        const deletionInfo = await attractionCollection.deleteOne({ _id: ObjectId(id) });
        if (deletionInfo.deletedCount === 0) {
            throw { statusCode: 500, message: `Could not delete attraction with id: ${id}` };
        }
        return true;
    } else throw { statusCode: 500, message: "Some error occured. Try again later" };
};

const addReviewInAttractions = async (attractionId, reviewId, rating) => {
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "reviewId is not a valid ObjectId" };
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: "attractionId is not a valid ObjectId" };
    const attractionCollection = await mongoCollections.attractions();
    let l_objAttraction = await getAttractionById(attractionId);
    if (!l_objAttraction || l_objAttraction === null || l_objAttraction === undefined) {
        throw { statusCode: 404, message: `No attraction exists with that id` };
    }
    let overallRating = await updateOverallRating_add(l_objAttraction.rating, rating, l_objAttraction.reviews.length + 1);
    let updateAttractionObj = {
        rating: overallRating,
    };
    const updatedInfo = await attractionCollection.updateOne(
        { _id: ObjectId(attractionId) },
        { $push: { reviews: reviewId }, $set: updateAttractionObj }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

const removeReviewFromAttractions = async (attractionId, reviewId, rating) => {
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "reviewId is not a valid ObjectId" };
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: "attractionId is not a valid ObjectId" };
    const attractionCollection = await mongoCollections.attractions();
    let l_objAttraction = await getAttractionById(attractionId);
    if (!l_objAttraction || l_objAttraction === null || l_objAttraction === undefined) {
        throw { statusCode: 404, message: `No attraction exists with that id` };
    }
    let overallRating = await updateOverallRating_remove(l_objAttraction.rating, rating, l_objAttraction.reviews.length - 1);
    let updateAttractionObj = {
        rating: overallRating,
    };
    const updatedInfo = await attractionCollection.updateOne(
        { _id: ObjectId(attractionId) },
        { $pull: { reviews: reviewId }, $set: updateAttractionObj }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `An error occurred while updating the city for this operation. Try again later` };
    }
    return true;
};

module.exports = {
    createAttraction,
    getAllAttraction,
    getAttractionById,
    getPopularAttractions,
    getAttractionsfromAttractionIdArr,
    deleteAttraction,
    addReviewInAttractions,
    removeReviewFromAttractions,
};
