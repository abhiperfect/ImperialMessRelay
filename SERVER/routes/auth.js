const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
var _ = require("lodash");
require("../models/user");
var bodyParser = require("body-parser");
const userModel = mongoose.model("userModel");


express().locals._ = _;
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(passport.initialize());
router.use(passport.session());
passport.use(userModel.createStrategy());

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.email,
      role: user.role
    });
  });
});
  
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//--------------  SIGN UP ROUTE -----------------
router.get("/signup", (req, res) => {
  res.render("auth/signup",{
    user: req.query.user
  });
})

router.post("/signup", (req, res)=>{
  const {name, email, hostel, room, gender} = req.body;
  userModel.register({ name: name, email: email, hostel: hostel, room: room, gender: gender}, req.body.password, async (err, user)=>{
    if(err){
        console.log(err);
        return res.status(422).json({error: "user already exists"});
    } 
    else{
        passport.authenticate("local")(req, res, () => {
            return res.status(200).json({msg: "signed up"});
        })
    }
  })
})


//--------------- SIGN IN ROUTE ------------------
router.get("/login", (req, res) => {
  res.render("auth/login");
})


router.post("/login", async (req, res) => {
  const user = new userModel({
      email: req.body.email,
      password: req.body.password
  })
  req.login(user, async function(err) {
      if (err) { 
          res.send(err);
      }else{
          const curUser = await userModel.findOne({email: user.email});
          if(!curUser){
              res.status(422).send({"error": "Email not registered"});
          }
          else{
              passport.authenticate("local")(req, res, ()=>{
                  res.redirect("/");
              });
          }
      }
  });
});


//--------------- LOGOUT ROUTE  ------------------------

router.post("/logout", (req, res) => {
  req.logout(function(err) {
      if (err) { 
          console.log(err);
       }
      res.send("logged out");
  });
});


//--------------- CHANGE PASSWORD ROUTE   -----------------------



//--------------  RESET PASSWORD ROUTE  -----------------------

module.exports = router