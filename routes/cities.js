const express = require("express");
const router = express.Router();
const data = require("../data");
const cityData = data.citiesData;
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.route("/").get(async (req, res) => {
    try {
        let l_arrCities = await cityData.getAllCities(0);
        return res.status(200).json(l_arrCities);
    } catch (e) {
        return res.status(500).json("Couldn't get all the cities!");
    }
});

router
    .route("/addCity")
    .get(async (req, res) => {
        try {
            return res.status(200).render("addCity", { title: "Add City" });
        } catch (e) {
            console.log(e, "e");
            return res.status(500).json("Nope still not working");
        }
    })
    .post(async (req, res) => {
        let name = req.body.nameInput;
        let state = req.body.stateInput;
        let country = req.body.countryInput;
        try {
            const checkif = await cityData.checkCity(name, state);
            if (checkif == true) {
                const newCity = await cityData.createCity(name, state, country);
                return res.status(200).render("addCity");
            } else {
                return res.status(200).render("addCity", { error: "city already exists in that state" });
            }
        } catch (e) {
            return res.status(500).render("addCity", { error: e });
        }
    });

router.route("/:cityId").get(async (req, res) => {
    let cityId = req.params.cityId;
    try {
        const cityList = await cityData.getCityById(cityId);
        const attrList = await attractionData.getAllAttraction(cityId.toString());
        res.status(404).render("cityDetails", { list1: cityList, list2: attrList });
    } catch (e) {
        console.log(e, "e");
        return res.status(500).json("Couldn't get the city and attractions");
    }
});

// router.route('/attraction/:id')
// .get(async (req, res) => {
//     id = req.params.id
//   try {
//     //if(!ObjectId.isValid(id)) return res.status(400).json("not a valid city")
//     const attractionFound = await attractionData.getAttractionById(id)
//     //if(!attractionFound) return res.status(404).json("not a valid attractionId")
//     return res.status(200).render('attractionDetails',  {singleAttraction: attractionFound});
// } catch (e) {
//     return res.status(404).json(e);
// }
// });

// .delete(async (req, res) => {
//   try {
//    if(!ObjectId.isValid(req.params.attractionId)) return res.status(400).json("not a valid object ID")
//     const attractionFound = await reviews.removeReview(req.params.attractionId);
//     if(!attractionFound) return res.status(404).json("no attraction found with")
//     return res.status(200).json(post);
// } catch (e) {
//     return res.status(404).json(e);
// }
// });

module.exports = router;
