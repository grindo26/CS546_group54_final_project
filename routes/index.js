const signUpRoutes = require("./signUp");
const loginRoutes = require("./login");
const userRoutes = require("./user");
const reviewsRoutes = require("./reviews");
const citiesRoutes = require("./cities");
const attractionsRoutes = require("./attractions");
const searchRoutes = require("./search");
const homeRoutes = require("./home");
const logoutRoutes = require("./logout");

const constructorMethod = (app) => {
    app.use("/", homeRoutes);
    app.use("/signUp", signUpRoutes);
    app.use("/reviews", reviewsRoutes);
    app.use("/user", userRoutes);
    app.use("/cities", citiesRoutes);
    app.use("/login", loginRoutes);
    app.use("/attractions", attractionsRoutes);
    app.use("/search", searchRoutes);
    app.use("/logout", logoutRoutes);
    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
