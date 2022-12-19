const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const usersDataCode = require("../data/users");
const attractionsData = require("../data/attractions");
const { comments } = require("../config/mongoCollections");

const createReview = async (userId, attractionId, rating, review) => {
    const reviewCollection = await mongoCollections.reviews();
    //validate and update all params
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    rating = await helperFunc.execValdnAndTrim(rating, "rating");
    rating = await helperFunc.validateRating(rating);
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: `userId provided is not a valid ObjectId` };
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: `attractionId provided is not a valid ObjectId` };
    review = await helperFunc.execValdnAndTrim(review, "review");
    let l_objUser = await usersDataCode.getUserFromUserId(userId);
    if (!l_objUser || l_objUser === null || l_objUser === undefined) {
        throw { statusCode: 404, message: "No user exists with this id" };
    }
    let l_objAttraction = await attractionsData.getAttractionById(attractionId);
    if (!l_objAttraction || l_objAttraction === null || l_objAttraction === undefined) {
        throw { statusCode: 404, message: `No attraction exists with that id` };
    }

    //check if user has already posted a review for this attraction before
    const reviewExists = await hasUserReviewedAttr(attractionId, userId);
    if (reviewExists && reviewExists.length > 0) {
        throw { statusCode: 409, message: "You have already a posted for this attraction. You cannot post another review." };
    }

    // validation ends-----------------
    let newReview = {
        reviewerId: userId,
        attractionId: attractionId,
        review: review,
        rating: rating,
        comments: [],
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a record into Review" };
    const newId = insertInfo.insertedId.toString();
    newReview._id = newId;
    // to insert id at the beginning
    const returnObj = Object.assign({ _id: newId }, newReview);
    const reviewAddedInAttraction = await attractionsData.addReviewInAttractions(attractionId, returnObj._id, returnObj.rating);
    const reviewAddedInUser = await usersDataCode.addReviewInUsers(returnObj._id, userId);
    if (reviewAddedInAttraction && reviewAddedInUser) {
        return returnObj;
    } else throw { statusCode: 500, message: "Some error occurred. Try again later" };
};

const getReviewById = async (id) => {
    id = await helperFunc.execValdnAndTrim(id, "reviewId");
    if (!ObjectId.isValid(id)) throw { statusCode: 400, message: `reviewId provided is not a valid ObjectId` };
    const reviewsCollection = await mongoCollections.reviews();
    const reviewObj = await reviewsCollection.findOne({ _id: ObjectId(id) });
    if (!reviewObj || reviewObj === null || reviewObj === undefined) throw { statusCode: 404, message: `No review exists with that id` };
    return reviewObj;
};

const getReviewsByReviewIdArr = async (reviewIdArr) => {
    const revArr = [];
    for (i = 0; i < reviewIdArr.length; i++) {
        let b = ObjectId(reviewIdArr[i]);
        revArr.push(b);
    }

    //   console.log(revArr, ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

    const reviewsCollection = await mongoCollections.reviews();
    const reviewArr = await reviewsCollection.find({ _id: { $in: revArr } }, { projection: { _id: 1, review: 1 } }).toArray();
    // console.log(reviewArr, "||||||||||||||||||||||||||")
    return reviewArr;
};

const updateReview = async (
    userId, attractionId, review
  ) => {
    const reviewCollection = await mongoCollections.reviews();
    let tempReview = await attractionsData.getAttractionById(attractionId)

    let updatedReview = {
        review: review,
    };

    const updatedInfo = await reviewCollection.updateOne(
        {_id: ObjectId(attractionId)},
        {$set: updatedReview}
    )
    if (updatedInfo.modifiedCount == 0) {
        throw 'could not update movie successfully';
      }
      
      console.log(updatedInfo, "updated info hai ye");
  }

// const getCommentsbyFindingInReviewCollection = async () => {

//     const commentObj = await movieCollection.findOne({ comments: { $elemMatch: {commentorId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310" } }, },
//     { projection: { _id: 0, comments: { $elemMatch: { commentorId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310"} }, }, }
//   );
//     console.log(commentObj, "Rukhsar did it")
//     return commentObj;
//     // //TO-DO
//     // const reviewsCollection = await mongoCollections.reviews();
//     // const comments = await reviewCollection.findOne({ reviews: { $elemMatch: { _id: ObjectId(reviewId) } }, },{ projection: { _id: 1, reviews: { $elemMatch: { _id: ObjectId(reviewId) } }, }, });
//     // comments= {7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310};
//     // return comments;
// }

const hasUserReviewedAttr = async (attractionId, userId) => {
    userId = await helperFunc.execValdnAndTrim(userId, "userId");
    attractionId = await helperFunc.execValdnAndTrim(attractionId, "attractionId");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: `userId provided is not a valid ObjectId` };
    if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: `attractionId provided is not a valid ObjectId` };
    const reviewCollection = await mongoCollections.reviews();
    const reviewExists = await reviewCollection.find({ attractionId: attractionId, reviewerId: userId }).toArray();
    return reviewExists;
};

const deleteReview = async (reviewId, userId) => {
    reviewId = await helperFunc.execValdnAndTrim(reviewId, "Review ID");
    if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "Review id provided is not a valid id." };
    const reviewsCollection = await mongoCollections.reviews();
    const reviewObj = await getReviewById(reviewId);
    if (reviewObj.reviewerId != userId) {
        throw { statusCode: 400, message: "Cannot delete this review. You are not the creator" };
    }
    const reviewRemovedFromAttraction = await attractionsData.removeReviewFromAttractions(reviewId, reviewObj.attractionId, reviewObj.rating);
    const reviewRemovedFromUsers = await usersDataCode.removeReviewFromUsers(reviewId, userId);
    if (reviewRemovedFromAttraction && reviewRemovedFromUsers) {
        const deletionInfo = await reviewsCollection.deleteOne({ _id: ObjectId(reviewId) });
        if (deletionInfo.deletedCount === 0) {
            throw { statusCode: 500, message: `Could not delete attraction with id: ${reviewId}` };
        }
        return true;
    } else throw { statusCode: 500, message: "Some error occured. Try again later" };
};

module.exports = {
    createReview,
    getReviewById,


    getReviewsByReviewIdArr,

    hasUserReviewedAttr,
    deleteReview,
};
