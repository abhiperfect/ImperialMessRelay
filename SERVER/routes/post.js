const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../routes/auth");
const postModel = mongoose.model("postModel"); 
const userModel = mongoose.model("userModel"); 
const cloudinary = require("../api/imageupload");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(express.json());


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
router.get("/createpost", async (req, res) => {
    if(req.isAuthenticated() && req.user.role == "student"){
        const curUser = await userModel.findById(req.user.id);
        res.render("createpost", {
            user: curUser
        });
    }else if(!req.user.hostel){
        req.flash("msg", "Please fill out these fields");
        res.redirect("/googleform");
    }
    else{
        res.redirect("/login");
    }
})



router.post("/createpost", async (req, res) => {
    if(req.isAuthenticated() && req.user.role == "student"){
        const posttitle = req.body.posttitle;
        const postbody = req.body.postbody;
        var postimagefile;
        if(!req.files.postimage){
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
            postimageURL = new Promise((resolve, rejct) => {
                cloudinary.uploader.upload(String(postimagefile.tempFilePath),
                  function(error, result) {
                    if(error){
                      console.log(error);
                    }
                    resolve(result.secure_url);
                  }
                );
            })
            postimageURL = await postimageURL;

            const post = new postModel({
                title: posttitle,
                body: postbody,
                photo: postimageURL,
                postedby: req.user.id,
                upvote: [],
                downvote: [], 
                comment: []
            });
            post.save(); 
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
        const post = await postModel.findById(req.body.ajaxPostId); // getting the post by post id
        const upvoteArray = post.upvote; // getting the upvote array
        const downvoteArray = post.downvote; // getting the downvote array
        const upvoteFound = upvoteArray.find((user) => user == req.user.id); // geting upvoted or not value
        const downvoteFound = downvoteArray.find((user) => user == req.user.id); // getting downvoted or not value
        // console.log(upvoteArray);
        var updatedPost;
        if(downvoteFound){ // If the user is downvoted then don't allow to upvote
            // return res.redirect("/")
            return res.send({response: upvoteArray.length})
        }
        else if(upvoteFound){ // If upvoted then cancel the upvote
             updatedPost = await postModel.findByIdAndUpdate(req.body.ajaxPostId, {$pull : {upvote: req.user.id}},{ new: true });
        }else{ // The user is eleigible to upvote
             updatedPost = await postModel.findByIdAndUpdate(req.body.ajaxPostId, {$push : {upvote: req.user.id}}, {new: true});
            
        }
        // res.redirect("/");
        res.send({response: updatedPost.upvote.length});
    }
    else{
        res.redirect("/");
    }
})


// ================= ! UPVOTE ROUTE ======================


// =============== DOWNVOTE ROUTE =======================

router.post("/downvote", async (req, res) => {
    if(req.isAuthenticated()){
        const post = await postModel.findById(req.body.ajaxPostId); // getting the post by post id
        const upvoteArray = post.upvote; // getting the upvoted users array
        const downvoteArray = post.downvote; // getting the downvoted users array
        const upvoteFound = upvoteArray.find((user) => user == req.user.id); // getting upvoted or not value
        const downvoteFound = downvoteArray.find((user) => user == req.user.id); // getting downvoted or not value
        var updatedPost;
        if(upvoteFound){ // If the the user is upvoted then don't allow to downvote
            return res.send({response: downvoteArray.length})
        }
        else if(downvoteFound){ // If the user is downvoted then remove his/her downvote
            updatedPost = await postModel.findByIdAndUpdate(req.body.ajaxPostId, {$pull : {downvote: req.user.id}}, {new: true});
        }else{ // If the user is eligible to downvote
            updatedPost = await postModel.findByIdAndUpdate(req.body.ajaxPostId, {$push : {downvote: req.user.id}}, {new: true});
           
        }
        res.send({response: updatedPost.downvote.length});
    }
    else{
        res.redirect("/");
    }
})

// ================= ! DOWNVOTE ROUTE ======================




//-------------- DELETING THE POST -----------------

module.exports = router;