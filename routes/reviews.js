const express = require("express");
const router = express.Router();
const data = require("../data");
const mongoCollections = require("../config/mongoCollections");
const reviewsData = data.reviewsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
router.route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get all movies!");
    }
});


router
.route('/reviews')
.post(async (req, res) => {
    id = req.params.attractionId;
  try {
    const reviewsCollection = await mongoCollections.reviews();
    //if(!ObjectId.isValid(id)) return res.status(400).json("not a valid city")
    const createdReview = await reviewsData.createReview(id);
    const insertInfo = await reviewsCollection.insertOne(createdReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add review";
//   const newId = insertInfo.insertedId.toString();
 //   newUser._id = newId;
    // to insert id at the beginning
 //   const returnObj = Object.assign({ _id: newId }, newUser);
 //   return returnObj;
    //if(!attractionFound) return res.status(404).json("not a valid attractionId")
    return res.status(200).render('attractionDetails',  {title: "Attraction Details", singleAttraction: attractionFound});
} catch (e) {
    return res.status(404).json(e);
}
});
module.exports = router;
