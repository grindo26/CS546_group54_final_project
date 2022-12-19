const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const xss = require('xss');

router
.route("/")
.get(async (req, res) => {
    req.session.destroy();
    return res.render('logout',{title:"Logout Page"});;
});
module.exports = router;
