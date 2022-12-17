const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.route("/").get(async (req, res) => {
    //code to fetch cities data
    let l_arrCities = await data.citiesData.getAllCities();
    //code to fetch attractions data
    let l_arrAttractions = await data.attractionsData.getPopularAttractions();
    //use this to render the profile thingy
    if (req.session.user) {
        return res.render("homepage", {
            cities: l_arrCities,
            attractions: l_arrAttractions,
            title: "Home",
            isLoggedIn: false,
        });
    } else {
        return res.render("homepage", {
            cities: l_arrCities,
            attractions: l_arrAttractions,
            title: "Home",
            isLoggedIn: true,
            userName: req.session.user,
        });
    }
});
module.exports = router;
