const express = require("express");
const router = express.Router();
const data = require("../data");
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

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
