const express = require("express");
const router = express.Router();
const data = require("../data");
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const multer = require("multer");
const { reviewsData } = require("../data");
const xss = require("xss");
const destinationImg = multer({ dest: "uploads/" });

router.route("/").get(async (req, res) => {
    try {
        return res.status(200).render("addAttraction", { title: "Add a new attraction" });
    } catch (e) {
        return res.status(404).json("Couldn't find what you're looking for");
    }
});

router.post("/", destinationImg.single("attrImg"), async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).render("userLogin", { message: "You must be logged in to add an attraction", title: "Login" });
        }
        let name = req.body.attractionInput;
        let cityId = req.body.cityInput;
        let price = req.body.priceInput;
        let location = req.body.locationInput;
        let reviews = [];
        let rating = 0;

        // TODO: when selecting one tag, an array isn't passed. Handle
        let tags = req.body.Tags;

        name = await helperFunc.execValdnAndTrim(xss(name), "Attraction Name");
        cityId = await helperFunc.execValdnAndTrim(xss(cityId), "City Id");

        if (!ObjectId.isValid(cityId)) {
            throw { statusCode: 400, message: "Sorry the city you selected doesn't exist. Please select another." };
        }
        price = await helperFunc.execValdnAndTrim(price, "price");
        await helperFunc.validatePriceRange(price);
        const imageData = fs.readFileSync(req.file.path);

        const addAttraction = await attractionData.createAttraction(
            xss(name),
            xss(cityId),
            xss(reviews),
            xss(rating),
            xss(price),
            imageData,
            xss(location),
            xss(tags),
            req.session.userId
        );

        return res.status(200).render("attractionDetails", { title: "Attraction", singleAttraction: addAttraction, userName: req.session.user });
    } catch (e) {
        return res.status(e.statusCode).render("error", { title: "Error", message: e.message });
    }
});

router
    .route("/:attractionId")
    .get(async (req, res) => {
        let id = req.params.attractionId;
        try {
            id = await helperFunc.execValdnAndTrim(id, "Attraction ID");
            if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Attraction id provided is not a valid id." };
            const attractionFound = await attractionData.getAttractionById(id);
            const reviewsFound = await reviewsData.getReviewsByReviewIdArr(attractionFound.reviews);

            return res.status(200).render("attractionDetails", {
                title: "Attraction Details",
                singleAttraction: attractionFound,
                userName: req.session.userName,
                reviewList: reviewsFound,
            });
        } catch (e) {
            return res.status(404).json(e);
        }
    })
    .delete(async (req, res) => {
        let id = req.params.attractionId;
        try {
            id = await helperFunc.execValdnAndTrim(id, "Attraction ID");
            if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Attraction id provided is not a valid id." };
            const attractionDeleted = await attractionData.deleteAttraction(id, req.session.userId);
            if (attractionDeleted) return res.redirect("/users/userProfile");
            else throw { statusCode: 500, message: "Some error occured. Try again later" };
        } catch (error) {
            return res.status(error.statusCode).render("error", { title: "Error", message: error.message });
        }
    });

module.exports = router;
