const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const xss = require('xss');

router
    .route("/")
    .get(async (req, res) => {
        try {
            if (req.session.user) {
                return res.redirect("/user/userProfile");
            }
            return res.render("userLogin", { title: "Login page" });
        } catch (e) {
            return res.status(404).json("Couldn't load home page");
        }
    })
    .post(async (req, res) => {
        try {
            req.session.returnTo = req.originalUrl;
            let username = req.body.usernameInput;
            let password = req.body.passwordInput;
            username = await helperFunc.execValdnAndTrim(username, "username");
            password = await helperFunc.execValdnAndTrim(password, "password");
            await helperFunc.isUsernameValid(username, "username");
            await helperFunc.isPasswordValid(password, "password");

            const create = await data.usersData.checkUser(xss(username), xss(password));
            if (create.authenticatedUser) {
                req.session.user = username;
                req.session.userId = create.userId;
                return res.redirect(req.session.returnTo || "/");
            }
        } catch (e) {
            return res.status(e.statusCode).render("userLogin", { title: "Login Page", message: e.message });
        }
    });

module.exports = router;
