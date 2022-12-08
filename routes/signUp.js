const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
router.route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get all movies!");
    }
});
module.exports = router;
