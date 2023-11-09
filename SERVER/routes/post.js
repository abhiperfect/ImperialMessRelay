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
    if(req.isAuthenticated()){
        const posttitle = req.body.posttitle;
        const postbody = req.body.postbody;
        var postimagefile;
        if(!req.body.postimage){
            postimagefile = null;
            const post = new postModel({
                title: posttitle,
                body: postbody,
                photo: postimagefile,
                postedby: req.user.id,
                upvote: [],
                downvote: [], 
                comment: []
            });
            post.save();
        }else{
            postimagefile = req.files.postimage;
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
        }
        res.redirect("/");
    }
    else{
        res.status(401).send({"error": "login first"});
        res.render("createpost");
    }
});

// =============== UPVOTE ROUTE =======================

router.post("/upvote", async (req, res) => {
    if(req.isAuthenticated()){
        const post = await postModel.findById(req.body.postid);
        const upvoteArray = post.upvote;
        const downvoteArray = post.downvote;
        const upvoteFound = upvoteArray.find((user) => user == req.user.id);
        const downvoteFound = downvoteArray.find((user) => user == req.user.id);
        if(downvoteFound){
            res.redirect("/");
        }
        else if(upvoteFound){
            await postModel.findByIdAndUpdate(req.body.postid, {$pull : {upvote: req.user.id}}).exec();
        }else{
            await postModel.findByIdAndUpdate(req.body.postid, {$push : {upvote: req.user.id}}).exec();
        }
        res.redirect("/");
    }
    else{
        res.redirect("/");
    }
})

// ================= ! UPVOTE ROUTE ======================


// =============== DOWNVOTE ROUTE =======================

router.post("/downvote", async (req, res) => {
    if(req.isAuthenticated()){
        const post = await postModel.findById(req.body.postid);
        const upvoteArray = post.upvote;
        const downvoteArray = post.downvote
        const upvoteFound = upvoteArray.find((user) => user == req.user.id);
        const downvoteFound = downvoteArray.find((user) => user == req.user.id);
        if(upvoteFound){
            res.redirect("/");
        }
        else if(downvoteFound){
            await postModel.findByIdAndUpdate(req.body.postid, {$pull : {downvote: req.user.id}}).exec();
        }else{
            await postModel.findByIdAndUpdate(req.body.postid, {$push : {downvote: req.user.id}}).exec();
        }
        res.redirect("/");
    }
    else{
        res.redirect("/");
    }
})

// ================= ! DOWNVOTE ROUTE ======================




//-------------- DELETING THE POST -----------------

module.exports = router;