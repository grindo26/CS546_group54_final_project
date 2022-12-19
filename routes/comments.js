const express = require("express");
const router = express.Router();
const data = require("../data");
const mongoCollections = require("../config/mongoCollections");
const reviewsData = data.reviewsData;
const commentsData = data.commentsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.route("/:commentId").delete(async (req, res) => {
    let commentId = req.params.commentId;
    let reviewId = req.query.reviewId;
    try {
        if (!req.session.userId) {
            return res.status(401).render("userLogin", { message: "You must be logged in to delete a comment", title: "Login" });
        }
        commentId = await helperFunc.execValdnAndTrim(commentId, "Comment ID");
        if (!ObjectId.isValid(commentId)) throw { statusCode: 400, message: "Comment id provided is not a valid id." };
        reviewId = await helperFunc.execValdnAndTrim(reviewId, "Review ID");
        if (!ObjectId.isValid(reviewId)) throw { statusCode: 400, message: "Review id provided is not a valid id." };
        const attractionDeleted = await commentsData.removeComment(commentId, reviewId, req.session.userId);
        if (attractionDeleted) return res.redirect("/users/userProfile");
        else throw { statusCode: 500, message: "Some error occured. Try again later" };
    } catch (error) {
        return res.status(error.statusCode).render("error", { title: "Error", message: error.message });
    }
});

module.exports = router;
