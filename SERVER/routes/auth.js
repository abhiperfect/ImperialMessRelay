const express = require("express");
const mongoose = require("mongoose"); //databse
const router = express.Router();        //routes
const passport = require("passport");    //Authentication
const session = require("express-session");
const googleStrategy = require("passport-google-oauth2").Strategy;
var _ = require("lodash");
var bodyParser = require("body-parser");
const userModel = mongoose.model("userModel");
const cloudinary = require("../api/imageupload");

express().locals._ = _;
router.use(session({
    secret: "abcd",
    resave: false,
    saveUninitialized: false
}))

router.use(passport.initialize());
router.use(passport.session());
router.use(require("../middlewares/flash"));
router.use(bodyParser.urlencoded({ extended: true }));

//============== LOCAL STRATEGY =========================

passport.use(userModel.createStrategy());

//============== ! LOCAL STRATEGY =======================

//============== GOOGLE STRATEGY ========================

passport.use(new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/googleform"
},
async function(accessToken, refreshToken, profile, done) {
  userModel.findOrCreate({name: profile.given_name, email: profile.email, googleId: profile.id}, function(err, user){

    return done(err, user);
  })
}
));

//============== ! GOOGLE STRATEGY ======================


passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//================ GOOGLE ROUTES =================

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/googleform", (req, res) => {
  passport.authenticate("google", {successRedirect: "/", failureRedirect: "/login"});
  // res.render("auth/googleform");
});

//================ ! GOOGLE ROUTES =================


//--------------  SIGN UP ROUTE -----------------
router.get("/signup", (req, res) => {
  const msg = req.flash("msg");
  var toastvalue;
  if(msg.length > 0){
    toastvalue = "d-block";
  }
  res.render("auth/signup",{
    toastvalue: toastvalue,
    msg: msg
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
  userModel.register({ name: name, email: email, hostel: hostel, room: room, gender: gender, role: role, profilephoto: profileimageURL, state: "normal"}, req.body.password, async (err, user)=>{
    if(err){
        res.render("/", {
          toastvalue: "d-block",
          msg: "Email already exists."
        })
    } 
    else{
        passport.authenticate("local")(req, res, () => {
          req.flash("msg", "user added successfully.");
          if(role == "student"){
            res.redirect("/");
          }
          else{
            res.redirect("/adminhome");
          }
        })
    }
  })
})


//--------------- SIGN IN ROUTE ------------------
router.get("/login", (req, res) => {
  const msg = req.flash("error");
  if(msg.length > 0){
    res.render("auth/login",{
      toastvalue: "d-block",
      msg: msg
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
  });
  const formname = req.body.formname;
  const checkUser = await userModel.find({email: user.email}).exec();
  if(checkUser.length == 0){
    req.flash("msg", "email not registered");
    res.redirect("/signup");
  }
  else if(checkUser[0].role !== formname){
    req.flash("msg", "Unauthorized");
    res.redirect("/");
  }
  else if(checkUser[0].state == "blocked"){
    req.flash("msg", "You are not allowed");
    res.redirect("/");
  }
  else{
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: "Incorrect password"})(req, res, ()=>{
      res.redirect("/");
    })
  }
});


//--------------- LOGOUT ROUTE  ------------------------

router.post("/logout", (req, res) => {
  req.logout(function(err) {
      if (err) { 
          console.log(err);
       }
      res.status(200).redirect("/");
      // res.status(200).send("logged out");
  });
});




//--------------- CHANGE PASSWORD ROUTE   -----------------------



//--------------  RESET PASSWORD ROUTE  -----------------------

module.exports = router