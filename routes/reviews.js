const express = require("express");
const router = express.Router();
const data = require("../data");
const mongoCollections = require("../config/mongoCollections");
const reviewsData = data.reviewsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const { users } = require("../config/mongoCollections");
router.route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get all movies!");
    }
});

// router.route("/reviews").post(async (req, res) => {
//     id = req.params.attractionId;
//     try {
//         const reviewsCollection = await mongoCollections.reviews();
//         //if(!ObjectId.isValid(id)) return res.status(400).json("not a valid city")
//         const createdReview = await reviewsData.createReview(id);
//         const insertInfo = await reviewsCollection.insertOne(createdReview);
//         if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add review";
//         return res.status(200).render("attractionDetails", { title: "Attraction Details", singleAttraction: attractionFound });
//     } catch (e) {
//         return res.status(404).json(e);
//     }
// });

router.route("/:attractionId").post(async (req, res) => {
    let attractionId = req.params.attractionId;
    let reviewText = req.body.reviewText;
    let rating = req.body.rating;
    try {
        //code to validate id
        attractionId = await helperFunc.execValdnAndTrim(attractionId);
        rating = await helperFunc.execValdnAndTrim(rating, "rating");
        rating = await helperFunc.validateRating(rating);
        if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: `attractionId provided is not a valid ObjectId` };
        reviewText = await helperFunc.execValdnAndTrim(reviewText, "review");
        if (!ObjectId.isValid(attractionId)) throw { statusCode: 400, message: `Id provided is not a valid ObjectId` };
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
    try {
        //code to check if attraction with this id exists
        let l_objAttraction = await data.attractionsData.getAttractionById(attractionId);
        if (!l_objAttraction || l_objAttraction === null || l_objAttraction === undefined) {
            throw { statusCode: 404, message: `No attraction exists with that id` };
        }
        //hardcoding for testing
        req.session.userId = "63932e0f542402fac0ee0011";
        if (!req.session.userId) {
            return res.status(401).render("userLogin", { message: "You must be logged in to post a review", title: "Login" });
        }
        let l_objReview = await data.reviewsData.createReview(req.session.userId, attractionId, rating, reviewText);
        return res.status(200).json(l_objReview);
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
});
module.exports = router;
