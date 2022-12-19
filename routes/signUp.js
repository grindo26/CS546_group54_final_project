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
        if (req.session.user) {
            return res.redirect("/");
        } else {
            return res.render("userRegister", { title: "Registeration Page" });
        }
    })
    .post(async (req, res) => {
        try {
            let name = req.body.nameInput;
            let age = req.body.ageInput;
            let username = req.body.usernameInput;
            let email = req.body.emailInput;
            let password = req.body.passwordInput;

            await helperFunc.execValdnAndTrim(name, "name");
            await helperFunc.execValdnAndTrim(age, "age");
            await helperFunc.execValdnAndTrim(username, "username");
            await helperFunc.execValdnAndTrim(email, "email");
            await helperFunc.execValdnAndTrim(password, "password");

            username = username.toLowerCase();

            await helperFunc.isNameValid(name, "name");
            await helperFunc.isAgeValid(age, "age");
            await helperFunc.isUsernameValid(username, "username");
            await helperFunc.isEmailValid(email, "email");
            await helperFunc.isPasswordValid(password, "password");

            const create = await data.usersData.createUser(xss(name), xss(username), xss(email), xss(age), xss(password));

            if (create) {
                return res.redirect("/login");
            } else {
                throw { statusCode: 404, message: "Internal Server Error" };
            }
        } catch (e) {
            return res.status(e.statusCode).render("error", { title: "Error", message: e.message });
        }
    });

module.exports = router;
