const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/user");
require("../models/post");

const {authrole} = require("../middlewares/authrole");
const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");




router.get("/profile", async (req, res) => {
    if(req.isAuthenticated()){
        const user = await userModel.findById( req.user.id ).exec();
        const post = await postModel.find( { postedby: req.user.id } ).exec();
        console.log(user);
        res.render("profile",{
            user: user,
            post: post
        });
    }
    else{
        res.redirect("/login");
    }
});


module.exports = router;