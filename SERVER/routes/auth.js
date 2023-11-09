const express = require("express");
const mongoose = require("mongoose"); //databse
const router = express.Router();        //routes
const passport = require("passport");    //Authentication
const session = require("express-session");
const path = require("path");  
var _ = require("lodash");
require("../models/user");
var bodyParser = require("body-parser");
const userModel = mongoose.model("userModel");
const cloudinary = require("../api/imageupload");

express().locals._ = _;
router.use(session({
    secret: "abcd",
    resave: false,
    saveUninitialized: false
}))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(passport.initialize());
router.use(passport.session());
passport.use(userModel.createStrategy()); //Stratgy to create local authentication by programmer


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
    user: req.query.user,
    toastvalue: "",
    msg: ""
  });
})

router.post("/signup", async (req, res)=>{
  const {name, email, hostel, room, gender, role} = req.body;
  var profileimageURL;
  if(!req.files){
    profileimageURL = "../images/dummyprofilepic.png";
  }else{
    var profileimage = req.files.profileimage;
    profileimageURL = new Promise((resolve, rejct) => {
      cloudinary.uploader.upload(String(profileimage.tempFilePath),
        function(error, result) {
          if(error){
            console.log(error);
          }
          resolve(result.secure_url);
        }
      );
    })

    profileimageURL = await profileimageURL;
  }
  userModel.register({ name: name, email: email, hostel: hostel, room: room, gender: gender, role: role, profilephoto: profileimageURL}, req.body.password, async (err, user)=>{
    if(err){
        res.render("auth/signup", {
          toastvalue: "show",
          msg: "Email already exists.",
          user: req.user
        })
    } 
    else{
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        })
    }
  })
})


//--------------- SIGN IN ROUTE ------------------
router.get("/login", (req, res) => {
  if(req.session.messages){
    res.render("auth/login",{
      toastvalue: "show",
      msg: "Incorrect password"
    });
  }else{
    res.render("auth/login",{
      toastvalue: "",
      msg: ""
    });
  }
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
              res.render("auth/signup", {
                toastvalue: "show",
                msg: "Sign up first.",
                user: req.user
              })
          }
          else{
              passport.authenticate("local", { failureRedirect: '/login', failureMessage: true })(req, res, ()=>{
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
      res.status(200).redirect("/");
  });
});


//--------------- CHANGE PASSWORD ROUTE   -----------------------



//--------------  RESET PASSWORD ROUTE  -----------------------

module.exports = router