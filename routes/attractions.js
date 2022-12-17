const express = require("express");
const router = express.Router();
const data = require("../data");
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const multer = require("multer");
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
        let name = req.body.attractionInput;
        let cityId = req.body.cityInput;
        let price = req.body.priceInput;
        let location = req.body.locationInput;
        let reviews = [];
        let rating = 0;
        // TODO: when selecting one tag, an array isn't passed. Handle
        let tags = req.body.Tags;

        name = await helperFunc.execValdnAndTrim(name, "Attraction Name");
        cityId = await helperFunc.execValdnAndTrim(cityId, "City Id");
        if (!ObjectId.isValid(cityId)) {
            throw { statusCode: 400, message: "Sorry the city you selected doesn't exist. Please select another." };
        }
        const imageData = fs.readFileSync(req.file.path);

        const addAttraction = await attractionData.createAttraction(name, cityId, reviews, rating, price, imageData, location, tags);
        return res.status(200).render("attractionAdded");
    } catch (e) {
        return res.status(500).json("Couldn't get the attraction!");
    }
});

router.route("/:attractionId").get(async (req, res) => {
    id = req.params.attractionId;
    try {
        const attractionFound = await attractionData.getAttractionById(id);
        return res
            .status(200)
            .render("attractionDetails", { title: "Attraction Details", singleAttraction: attractionFound, userName: req.session.userName });
    } catch (e) {
        return res.status(404).json(e);
    }
});

module.exports = router;
