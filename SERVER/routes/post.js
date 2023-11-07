const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {authrole} = require("../middlewares/authrole")
const postModel = mongoose.model("postModel"); 
const cloudinary = require("../api/imageupload");


//============== SHOW ALL POST =====================

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
router.get("/createpost", (req, res) => {
    if(req.isAuthenticated()){
        res.render("createpost");
    }
    else{
        res.redirect("/login");
    }
})


router.post("/createpost",authrole(["student"]) , async (req, res) => {
    console.log("dfd");
    if(req.isAuthenticated()){
        const posttitle = req.body.posttitle;
        const postbody = req.body.postbody;
        const postimagefile = req.files.postimage;

        cloudinary.uploader.upload(String(postimagefile.tempFilePath), { public_id: req.user.name },
            function(error, result) {
                if(error){ console.log(error); }
                const post = new postModel({
                    title: posttitle,
                    body: postbody,
                    photo: result.secure_url,
                    postedby: req.user.id,
                    upvote: [],
                    downvote: [], 
                    comment: []
                });
                post.save(); 
            }
        );
        res.redirect("/");
    }
    else{
        // res.status(401).send({"error": "login first"});
        res.render("newpost");
    }
});

//-------------- DELETING THE POST -----------------

module.exports = router;