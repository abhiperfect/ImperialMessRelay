const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {authrole} = require("../middlewares/authrole")
const postModel = mongoose.model("postModel"); 


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
router.post("/createpost",authrole(["student"]) , async (req, res) => {
    if(req.isAuthenticated()){
        console.log(req);
        const newPost = new postModel({
            title: req.body.title,
            body: req.body.body,
            postedby: req.user.id
        });
        newPost.save();
    }
    else{
        res.status(401).send({"error": "login first"});
    }
});

//-------------- DELETING THE POST -----------------

module.exports = router;