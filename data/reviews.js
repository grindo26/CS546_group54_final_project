const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createReview = async (userId, attractionId, rating, review) => {
    const reviewCollection = await mongoCollections.reviews();
    //validate and update all params
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    rating = await helperFunc.execValdnAndTrim(rating, "rating");
    review = await helperFunc.execValdnAndTrim(review, "review");

    // validation ends-----------------
    let newReview = {
        reviewerId: userId,
        attractionId: attractionId,
        review: review,
        rating: rating,
        comments: [],
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add a record into Review";
    const newId = insertInfo.insertedId.toString();
    newReview._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newReview);
    return returnObj;
};

module.exports = {
    createReview,
};
