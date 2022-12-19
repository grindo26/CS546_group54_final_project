const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const reviewsData = require("../data/reviews");
const usersDataCode = require("../data/users");

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
    const l_objComment = l_objReview.comments[l_objReview.comments.length - 1];
    const commentAddedInUser = await usersDataCode.addCommentInUsers(userId, l_objComment._id);
    return l_objComment;
};

const getCommentById = async (commentId) => {
    commentId = await helperFunc.execValdnAndTrim(commentId, "Comment ID");
    if (!ObjectId.isValid(commentId)) throw { statusCode: 400, message: "Comment id provided is not a valid id." };
    const reviewCollection = await mongoCollections.reviews();
    const comments = await reviewCollection.findOne(
        { comments: { $elemMatch: { _id: ObjectId(commentId) } } },
        { projection: { _id: 1, comments: { $elemMatch: { _id: ObjectId(commentId) } } } }
    );
    return comments;
};

const getCommentByUserId = async (commenterId) => {
    commenterId = await helperFunc.execValdnAndTrim(commenterId, "Commenter ID");
    if (!ObjectId.isValid(commenterId)) throw { statusCode: 400, message: "Commenter id provided is not a valid id." };
    const reviewCollection = await mongoCollections.reviews();
    const comments = await reviewCollection.findOne(
        { comments: { $elemMatch: { commenterId: commenterId } } },
        { projection: { _id: 1, comments: { $elemMatch: { commenterId: commenterId } } } }
    );
    return comments;
};

const getReviewByCommentId = async (commentId) => {
    commentId = await helperFunc.execValdnAndTrim(commentId, "Comment ID");
    if (!ObjectId.isValid(commentId)) throw { statusCode: 400, message: "Comment id provided is not a valid id." };
    const reviewsCollection = await mongoCollections.reviews();
    const comments = await reviewCollection.findOne({ comments: { $elemMatch: { commenterId: commenterId } } });
    return comments;
};

const removeComment = async (commentId, reviewId, userId) => {
    commentId = await helperFunc.execValdnAndTrim(commentId, "Comment ID");
    if (!ObjectId.isValid(commentId)) throw { statusCode: 400, message: "Comment id provided is not a valid id." };
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "reviewId ID");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "reviewId id provided is not a valid id." };
    userId = await helperFunc.execValdnAndTrim(userId, "User ID");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "userId id provided is not a valid id." };
    const reviewsCollection = await mongoCollections.reviews();
    const reviewObj = await getReviewById(reviewId);
    const commentObj = await getCommentById(commentId);
    if (commentObj.commmenterId != userId) {
        throw { statusCode: 400, message: "Cannot delete this comment. You are not the creator" };
    }
    const commentRemovedFromUsers = await usersDataCode.removeCommentFromUsers(commentId, userId);
    if (commentRemovedFromUsers) {
        const updatedInfo = await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $pull: { comments: commentId } });
        if (updatedInfo.modifiedCount === 0) {
            throw { statusCode: 500, message: `An error occurred while updating the user for this operation. Try again later` };
        }
        return true;
    } else throw { statusCode: 500, message: "Some error occured. Try again later" };
};

module.exports = {
    createComment,
    removeComment,
};
