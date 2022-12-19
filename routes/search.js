const express = require("express");
const router = express.Router();
const data = require("../data");
const searchingData = data.searchData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const path = require("path");
const xss = require('xss');

router
    .route("/search")
    .get(async (req, res) => {
        try {
            return res.status(200).render("searchPage", { title: "Search Results" });
        } catch (e) {
            return res.status(500).json("Somethings Wrong");
        }
    })
    .post(async (req, res) => {
        let searchString = req.body.searchInput;
        try {
            searchString = await helperFunc.execValdnAndTrim(searchString, "Search String");
            await helperFunc.isNameValid(searchString, "Search String");
            const searchForCity = await searchingData.searchCity(searchString);
            const searchForAttraction = await searchingData.searchAttraction(searchString);

            return res.status(200).render("searchPage", { list1: searchForCity, list2: searchForAttraction, title: 'Search Results' });
            if(searchForCity.length == 0 && searchForAttraction.length == 0) {
                throw { statusCode: 400, message: `Couldn't find the City or Attraction you are looking for`}
            }
            return res.status(200).render("searchPage", { list1: searchForCity, list2: searchForAttraction });
        } catch (e) {
            return res.status(e.statusCode).render("searchPage", { title : "Error" , error: e.message });
        }
    });
module.exports = router;
