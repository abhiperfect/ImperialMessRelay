const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {authrole} = require("../middlewares/authrole")
const postModel = mongoose.model("postModel"); 
const PostModel = require("../models/post");


//------------------    SHOW ALL POST   ------------------------

router.get("/allpost", async (req, res) => {
    res.send(await postModel.find().populate("postedby"));
})

//--------- SHOW POSTS OF SIGNED IN USER ------------------

router.get("/mypost", async (req, res) => {
    if(req.isAuthenticated()){
        res.send(await postModel.find({postedby: req.user.id}).exec());
    }
    else{
        res.status(401).send("login first");
    }
})

//-----   CREATING A NEW POST (ONLY BY ROLE == STUDENT)   -----
router.get("/createpost", async(req, res) => {
    
    res.render("createpost");
})

// Checking create route
router.post("/posted",async (req, res)=>{
    console.log(req.body);
    if(req.isAuthenticated()){
    const author = new postModel({
        title: req.body.title,
        body: req.body.body,
        photo: req.body.photo,
        postedby: req.user.id,
    })
    author.save().then(async item => {
        const allPost = await postModel.find().populate("postedby").exec();
        res.render("index",{
            allPost: allPost
        })    
    })
    }
    else{
        res.status(401).send({"error": "login first"});
        res.render("createpost");
    }
});


//-------------- DELETING THE POST -----------------

module.exports = router;