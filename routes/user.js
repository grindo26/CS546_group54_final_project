const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
router.route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get user page");
    }
});

router.route("/userProfile").get(async (req, res) => {
    try {
        if (!req.session.userId) return res.redirect("/login");
        else {
            const userData = await data.usersDataCode.getUserFromUserId(req.session.userId);
            const attractionsFound = await data.attractionsData.getAttractionsfromAttractionIdArr(userData.attractions);
            const reviewsFound = await data.reviewsData.getReviewsByReviewIdArr(userData.reviews);
            //         const commentsFound = await data.reviewsData.getCommentsbyFindingInReviewCollection()
            //      console.log(reviewsFound, "?????????????????")
            //         console.log(attractionsFound, "||||||||||||")
            //        console.log(commentsFound, "???????????????????")

            //     const revData = await data.reviewsData.getReviewByUserId(req.session.userId)
            //     const reviewsFound = await data.reviewsData.getReviewByUserId(revData.review)
            return res
                .status(200)
                .render("userProfile", { user: userData, title: "User Profile", displayAttractions: attractionsFound, displayReviews: reviewsFound });
        }
    } catch (e) {
        return res.status(500).json("Couldn't get user profile");
    }
});
module.exports = router;
