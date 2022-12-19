const express = require("express");
const app = express();
const multer = require("multer");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require("express-session");
const static = express.static(__dirname + "/public");
const path = require("path");
const bodyParser = require("body-parser");

const mongodb = require("mongodb");
const router = express.Router();
const mongoClient = mongodb.MongoClient;
const fs = require("fs");
var locationPicker = require("location-picker");

app.use(express.json());
app.use("/public", static);
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(bodyParser.urlencoded({ extended: true }));
const destinationImg = multer({ dest: "uploads/" });

app.use(
    session({
        name: "AuthCookie",
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/login", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/user/userProfile");
    } else {
        next();
    }
});

app.use("/signUp", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/user/userProfile");
    } else {
        next();
    }
});

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// const imageFilter = function(req, file, cb) {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// exports.imageFilter = imageFilter;

// function insertFile(file, res) {
//     mongoClient.connect("mongodb+srv://city:cityscan@cityscanner.uhcyu36.mongodb.net/test", { useNewUrlParser: true }, (err, client) => {
//         if (err) {
//             return err;
//         } else {
//             let db = client.db("uploadDB");
//             let collection = db.collection("Attractions");
//             try {
//                 collection.insertOne(file);
//             } catch (err) {
//                 console.log("Error while inserting", err);
//             }
//             client.close();
//             res.redirect("/");
//         }
//     });
// }

// router.post("/attractions", (req, res) => {
//     let file = { name: req.body.name, file: binary(req.files.uploadedFile.data) };
//     insertFile(file, res);
// });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/images");
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + ".jpg" + Date.now() + path.extname(file.originalname));
//     },
// });

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
