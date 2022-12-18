const express = require("express");
const router = express.Router();
const data = require('../data')
const searchingData = data.searchData;
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const path = require("path");



router
.route('/search')
.get(async (req,res) => {
    try{
        return res.status(200).render('searchPage', {title: "Search Page"})
    } catch(e){
        console.log(e, "e");
        return res.status(500).json("Somethings Wrong")
    }
})
.post(async (req,res) => {
    let searchString = req.body.searchInput
    try{
        searchString = await helperFunc.execValdnAndTrim(searchString, "searchbar")
        searchString = await helperFunc.isNameValid(searchString, "searchbar")
        const searchForCity = await searchingData.searchCity(searchString);
        const searchForAttraction = await searchingData.searchAttraction(searchString)
        return res.status(200).render('searchPage',{list1 : searchForCity , list2: searchForAttraction})
    } catch(e){
        return res.status(500).render('searchPage', {error: e})
    }
})

module.exports = router;
