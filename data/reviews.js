const helperFunc = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const usersData = require("../data/users");
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
    let l_objUser = await usersData.getUserFromUserId(userId);
    if (!l_objUser || l_objUser === null || l_objUser === undefined) {
        throw { statusCode: 404, message: "No user exists with this id" };
    }
    let l_objAttraction = await attractionsData.getAttractionById(attractionId);
    if (!l_objAttraction || l_objAttraction === null || l_objAttraction === undefined) {
        throw { statusCode: 404, message: `No attraction exists with that id` };
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
    return returnObj;
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
    
    const revArr=[];
    for(i=0; i<reviewIdArr.length;i++){
      let b = ObjectId(reviewIdArr[i])
      revArr.push(b)
   }
   
//   console.log(revArr, ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

   const reviewsCollection = await mongoCollections.reviews();
   const reviewArr = await reviewsCollection.find({ _id: {$in: revArr}},{projection: {_id: 1, review:1}}).toArray();
// console.log(reviewArr, "||||||||||||||||||||||||||")
   return reviewArr;
};

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

module.exports = {
    createReview,
    getReviewById,
    getReviewsByReviewIdArr
};
