const express = require("express");
const router = express.Router();
const data = require("../data");
const cityData = data.citiesData;
const attractionData = data.attractionsData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const xss = require('xss');

router.route("/").get(async (req, res) => {
    try {
        let l_arrCities = await cityData.getAllCities(0);
        return res.status(200).render('citiesList', {title: 'All Cities', displayCities: l_arrCities});
    } catch (e) {
        return res.status(500).json("Couldn't get all the cities!");
    }
});

router
    .route("/addCity")
    .get(async (req, res) => {
        try {
            if (!req.session.userId){
                return res.status(200).render("addCity", {message: 'Please login/SignUp before adding city'})
            }
            return res.status(200).render("addCity", { title: "Add City" });
        } catch (e) {
            return res.status(500).json("Couldn't load Add-City Page");
        }
    })
    .post(async (req, res) => {
        let name = req.body.nameInput;
        let state = req.body.stateInput;
        let country = req.body.countryInput;
        try {
            name = await helperFunc.execValdnAndTrim(name, "Name");
            state = await helperFunc.execValdnAndTrim(state, "State");
            country = await helperFunc.execValdnAndTrim(country, "Country");
            await helperFunc.isNameValid(name, "Name");
            await helperFunc.isNameValid(state, "State");
            await helperFunc.isNameValid(country, "Country");
            const checkif = await cityData.checkCity(name, state);
            if (checkif == true) {
                const newCity = await cityData.createCity(xss(name), xss(state), xss(country));
                return res.status(200).render("addCity");

            } else {
                return res.status(200).render("addCity", { error: "City already exists in that state" });
            }
        } catch (e) {
            return res.status(e.statusCode).render("addCity", { error: e.message });
        }
    });

router.route("/:cityId").get(async (req, res) => {
    let cityId = req.params.cityId;
    try {
        const cityList = await cityData.getCityById(cityId);
        const attrList = await attractionData.getAllAttraction(cityId.toString());
        return res.status(404).render("cityDetails", { list1: cityList, list2: attrList, title: 'City Insights'});
    } catch (e) {
        return res.status(500).render('error');
    }
    try {
        const cityList = await cityData.getCityById(cityId);
        try {
            const attrList = await attractionData.getAllAttraction(cityId)
            return res.status(200).render("cityDetails", { list1: cityList, list2: attrList });
        } catch (error) {
            return res.status(404).render("cityDetails", { list1: cityList});
        }
    } catch (error) {
        return res.status(error.statusCode).render('cityDetails', {error: error.message});
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
