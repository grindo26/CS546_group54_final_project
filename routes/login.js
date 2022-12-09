const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');

router
.route("/")
.get(async (req, res) => {
    try {
        return res.render('userLogin', {title: "Login page"});
    } catch (e) {
        return res.status(500).json("Couldn't load home page");
    }
})
.post(async (req, res) => {
    try{
      let username = req.body.usernameInput;
      let password = req.body.passwordInput;

       if(typeof username == 'undefined') throw "Please enter the username"
       if(typeof password == 'undefined') throw "Please enter the password"
       if(typeof username != 'string' || typeof password != 'string') throw "Id and password must be string"
       if(username.length < 4) throw "username should have more than 4 characters"
       if(password.length < 6) throw "passwored should have more than 6 characters"
       if(/\s/.test(username) || /\s/.test(password)) throw "username & password cannot have empty spaces"
       if(username.trim().length === 0 || password.trim().length === 0) throw "username or password cannot be empty spaces"
       
       username = username.toLowerCase();
    
      let alphaNum = /^[A-Za-z0-9]+$/;
      if(!username.match(alphaNum)) throw "username can only be alpha-numeric"
      
      let passwordConstaints = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/
      
      if(!password.match(passwordConstaints)) throw "password should contain atleast an uppercase letter, a special character and a number and should be minimum 6 characters long"

      const create = await data.usersData.checkUser(username,password);
      if(create){
      req.session.user = username;
      return res.render('homepage', {title: "Home Page"});
      }

     }
     catch(e){
      return res.status(400).render('userLogin', {title: "Login Page",error:"Error status 400: "+e});
      }

  })

module.exports = router;
