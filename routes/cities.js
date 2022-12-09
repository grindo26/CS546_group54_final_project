const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.
route("/").get(async (req, res) => {
    try {
        return res.status(200).json({ Hello: "There" });
    } catch (e) {
        return res.status(500).json("Couldn't get all movies!");
    }
});

router
.route('/:attractionId')
.get(async (req, res) => {
  try {
    if(!ObjectId.isValid(req.params.attractionId)) return res.status(400).json("not a valid city")
    const attractionFound = await data.attractionsData.getAttractionById(req.params.attractionId)
    if(!attractionFound) return res.status(404).json("not a valid attractionId")
    return res.status(200).render('attractionDetails',  {attraction: attractionFound._id});
} catch (e) {
    return res.status(404).json(e);
}
});

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
