const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router
.route("/")
.get(async (req, res) => {
    if(req.session.user){
    return res.render('homepage', {title: "Home Page"});
    }
    else{
        return res.render('userLogin', {title: "Login Page"});
    }
});
module.exports = router;
