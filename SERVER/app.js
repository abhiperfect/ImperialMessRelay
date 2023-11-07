const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require("path");
const fileUpload = require("express-fileupload");
require("dotenv").config();
require("./models/user");
require("./models/post")

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", ("../CLIENT/views"));
app.use(express.static(path.join(__dirname,  "../", "/CLIENT/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({useTempFiles: true}));
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/profile"));

mongoose.connect("mongodb://127.0.0.1:27017/messDB").then(() => console.log("Connected!"));

const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");

app.get("/", async (req, res) => {
    const allPost = await postModel.find().populate("postedby").exec();
    res.render("index",{
        allPost: allPost
    })
})

app.listen(port, ()=>{
    console.log("Server running.....");
});