const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const reviewsData = require("../data/reviews");

const createComment = async (userId, comment, reviewId) => {
    const reviewCollection = await mongoCollections.reviews();
    //validate and update all params
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    comment = await helperFunc.execValdnAndTrim(comment, "comment");
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: `reviewId provided is not a valid ObjectId` };
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: `userId provided is not a valid ObjectId` };
    // validation ends-----------------
    let newComment = {
        _id: ObjectId(),
        commenterId: userId,
        comment: comment,
    };

    const updatedInfo = await reviewCollection.updateOne({ _id: ObjectId(reviewId) }, { $push: { comments: newComment } });
    if (updatedInfo.modifiedCount === 0) {
        throw { statusCode: 500, message: `could not update the review with id: ${reviewId}` };
    }
    const l_objReview = await reviewsData.getReviewById(reviewId);
    return l_objReview.comments[l_objReview.comments.length - 1];
};

module.exports = {
    createComment,
};
