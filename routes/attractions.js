const express = require("express");
const router = express.Router();
const data = require("../data");
const cityData = data.citiesData;
const attractionData = data.attractionsData;
const reviewData = data.reviewData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const { reviewsData } = require("../data");

router.route("/").get(async (req, res) => {
    try {
        return res.status(200).render('addAttraction')
    } catch (e) {
        return res.status(500).json("Couldn't get the attraction!");
    }
})
.post(async (req, res) => {
    try {

        let name = req.body.attractionInput;
        let cityName = req.body.cityInput;
        let price = req.body.priceInput
        let location = req.body.Location;
        let reviews = ["good", "hvhvh"];
        let rating = 4.6;
        let photo = "xyssfdjnnz"
        let tags=["hi", "hello"];
        
        await helperFunc.execValdnAndTrim(name, "name")
        await helperFunc.isNameValid(name, "name")

        const cityFound = await cityCollection.findOne({ name: cityName });
        let cityId=cityFound._id;

        const addAttraction = await attractionData.createAttraction(name, cityId, reviews, rating, price, photo, location, tags);
        return res.status(200).render('attractionAdded')
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
    const attractionFound = await attractionData.getAttractionById(id);
    //if(!attractionFound) return res.status(404).json("not a valid attractionId")
    return res.status(200).render('attractionDetails',  {title: "Attraction Details", singleAttraction: attractionFound, reviews: attractionFound.reviewArray});
} catch (e) {
    return res.status(404).json(e);
}
});


module.exports = router;
