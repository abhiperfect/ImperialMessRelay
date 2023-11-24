const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config();
require("./models/user");
require("./models/post");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../CLIENT/views"));
app.use(express.static(path.join(__dirname,  "../", "/CLIENT/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({useTempFiles: true}));

mongoose.connect("mongodb://127.0.0.1:27017/messDB").then(() => console.log("Connected!")); 

const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");

// ===== ROUTER FILES =========
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/profile"));
app.use(require("./routes/about"));
app.use(require("./routes/admin"));
app.use(require("./middlewares/flash"));
// ===== ! ROUTER FILES =======


app.get("/", async (req, res) => {
    const msg = req.flash("msg");
    var toastvalue = "";
    if(req.isAuthenticated()){
        if(!req.user.hostel && req.user.role == "student"){
            res.redirect("/googleform");
        }
        if(req.user.role == "admin"){
            res.redirect("/adminhome");
        }else if(req.user.role == "chiefwarden"){
            const user = await userModel.find({role: "student"}).exec();
            const post = await postModel.find().populate("postedby").exec();
            // console.log(user);
            // console.log(post);
            // console.log(user[0].name);
            res.render("chiefwarden",
            {
                Alluser: user,
                Allpost: post
            }
            ); 
        }
        else{
            const allPost = await postModel.find().populate("postedby");
            res.render("index",{
                allPost: allPost,
                user: "authenticated",
                toastvalue: "",
                msg: ""
            })
        }
    }
    else{
        if(msg.length > 0){
            toastvalue = "d-block";
        }
        res.render("index",{
            toastvalue: toastvalue,
            user: "notAuthenticated",
            msg: msg
        })
    }
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running.....");
});