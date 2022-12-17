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

router.route("/form").get(async (req, res) => {
    try {
        req.session.userId = "63932e0f542402fac0ee0011";
        req.session.user = "Dipankar";
        if (!req.session.user) {
            return res.status(401).render("userLogin", { message: "You must be logged in to post a review", title: "Login" });
        }
        req.session.attractionId = req.query.attractionId;
        return res.status(200).render("reviewForm", { title: "Add a review", attractionId: req.session.attractionId });
    } catch (error) {
        return res.status(404).json("Couldn't get the form");
    }
});

router.route("/comments/").post(async (req, res) => {
    let reviewId = req.session.reviewId;
    let commentText = req.body.commentText;
    try {
        //code to validate id
        reviewId = await helperFunc.execValdnAndTrim(reviewId);
        if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: `reviewId provided is not a valid ObjectId` };
        commentText = await helperFunc.execValdnAndTrim(commentText, "comment");
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
    try {
        //code to check if review with this id exists
        let l_objReview = await data.reviewsData.getReviewById(reviewId);
        if (!l_objReview || l_objReview === null || l_objReview === undefined) {
            throw { statusCode: 404, message: `No review exists with that id` };
        }
        //hardcoding for testing
        req.session.userId = "63932e0f542402fac0ee0011";
        req.session.user = "Dipankar";
        if (!req.session.userId) {
            return res.status(401).render("userLogin", { message: "You must be logged in to post a comment", title: "Login" });
        }
        let objComment = await data.commentsData.createComment(req.session.userId, commentText, reviewId);
        if (!objComment || objComment === null || objComment === undefined)
            throw { statusCode: 500, message: `Couldn't add the comment. Try again later` };
        let returnObj = Object.assign(objComment, { username: req.session.user });
        return res.status(200).json(returnObj);
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
});

router.route("/:attractionId").post(async (req, res) => {
    let attractionId = req.params.attractionId;
    let reviewText = req.body.reviewTxt;
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
        req.session.user = "Dipankar";
        if (!req.session.userId) {
            return res.status(401).render("userLogin", { message: "You must be logged in to post a review", title: "Login" });
        }
        let l_objReview = await data.reviewsData.createReview(req.session.userId, attractionId, rating, reviewText);
        let returnObj = Object.assign(l_objReview, { username: req.session.user });
        req.session.reviewId = returnObj._id;
        return res.status(200).render("reviewDetails", { title: "ReviewDetails", reviewObj: returnObj });
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
});

router.route("/:reviewId").get(async (req, res) => {
    let reviewId = req.params.reviewId;
    try {
        //code to validate id
        reviewId = await helperFunc.execValdnAndTrim(reviewId);
        if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: `reviewId provided is not a valid ObjectId` };
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
    try {
        //code to check if review with this id exists
        let l_objReview = await data.reviewsData.getReviewById(reviewId);
        if (!l_objReview || l_objReview === null || l_objReview === undefined) {
            throw { statusCode: 404, message: `No review exists with that id` };
        }
        //hardcoding for testing
        // req.session.userId = "63932e0f542402fac0ee0011";
        // req.session.user = "Dipankar";
        // if (!req.session.userId) {
        //     return res.status(401).render("userLogin", { message: "You must be logged in to post a comment", title: "Login" });
        // }
        return res.status(200).render("reviewDetails", { reviewObj: l_objReview, title: "Review" });
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", status: error.statusCode, message: error.message });
    }
});

module.exports = router;
