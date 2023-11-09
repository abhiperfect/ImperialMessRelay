const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    body:{
        type: String
    },
    commentedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "usermodel"
    },
    commentedon:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "postmodel"
    }
})

mongoose.model("commentmodel", commentSchema);