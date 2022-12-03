const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");

const createComment = async (userId, comment, reviewId) => {
    const reviewCollection = await mongoCollections.reviews();
    //validate and update all params
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    comment = await helperFunc.execValdnAndTrim(comment, "comment");
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw "invalid object ID";
    // validation ends-----------------
    let newComment = {
        _id: ObjectId(),
        commenterId: userId,
        comment: comment,
    };

    const updatedInfo = await reviewCollection.updateOne({ _id: ObjectId(reviewId) }, { $push: { comments: newComment } });
    if (updatedInfo.modifiedCount === 0) {
        throw `could not update the review with id: ${reviewId}`;
    }
    return true;
};

module.exports = {
    createComment,
};
