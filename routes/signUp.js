const express = require("express");
const router = express.Router();
const data = require("../data");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');

router
.route("/")
.get(async (req, res) => {
   
    if(req.session.user)
    {
      return res.redirect('/');
    }
     else{
      return res.render('userRegister', {title: "Registeration Page"});
         }
})
.post(async (req, res) => {

 try{
  
 let name = req.body.nameInput;  
 let age= req.body.ageInput; 
 let username = req.body.usernameInput;
 let email = req.body.emailInput;
 let password = req.body.passwordInput;
 
  if(typeof username == 'undefined') throw "Please enter the username"
  if(typeof password == 'undefined') throw "Please enter the password"
  if(typeof username != 'string' || typeof password != 'string') throw "Id and password must be string"
  if(username.trim().length < 4) throw "username should have more than 4 characters"
  if(password.trim().length < 6) throw "passwored should have more than 6 characters"
  if(/\s/.test(username) || /\s/.test(password)) throw "username & password cannot have empty spaces"
  if(username.trim().length === 0 || password.trim().length === 0) throw "username or password cannot be empty spaces"
  username = username.toLowerCase();
  
  if(age<10) throw "Oops! Age limit for our app is above 10 years"

  let alphaNum = /^[A-Za-z0-9]+$/;
  if(!username.match(alphaNum)) throw "username can only be alpha-numeric"
  
  let passwordConstaints = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/
  
  if(!password.match(passwordConstaints)) throw "password should contain atleast an uppercase letter, a special character and a number and should be minimum 6 characters long"
 
  const create = await data.usersData.createUser(name,username,email,age,password);
    if(create) {
    return res.redirect('/login');
    } else{
      throw "Internal Server Error";
    }

   }
   catch(e){
    if(e == "Internal Server Error") {
      return res.status(500).render('forbiddenAccess', {title: "Forbidden Access Page",error:"Error status 500: "+e});
    } else{
      return res.status(400).render('userRegister', {title: "Registeration Page",error:"Error status 400: "+e});
    }
    }

  })

module.exports = router;
