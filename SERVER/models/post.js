const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type: String
    },
    body:{
        type: String
    },
    photo:{
        type: String,
        default: "no photo"
    },
    postedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    }, 
    upvote:{
        type: Array,
        default: []
    },
    downvote:{
        type: Array,
        default: []
    },
    comment:{
        type: Array,
        default: []
    }
})

mongoose.model("postModel", postSchema);