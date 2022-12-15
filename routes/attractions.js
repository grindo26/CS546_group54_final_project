const express = require("express");
const router = express.Router();
const data = require("../data");
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get the attraction!");
    }
});

router
.route('/:attractionId')
.get(async (req, res) => {
    id = req.params.attractionId;
  try {
    //if(!ObjectId.isValid(id)) return res.status(400).json("not a valid city")
    const attractionFound = await attractionData.getAttractionById(id)
    //if(!attractionFound) return res.status(404).json("not a valid attractionId")
    return res.status(200).render('attractionDetails',  {title: "Attraction Details", singleAttraction: attractionFound});
} catch (e) {
    return res.status(404).json(e);
}
});


module.exports = router;
