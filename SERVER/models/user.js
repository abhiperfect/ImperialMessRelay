const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String
    },
    role:{
        type: String
    },
    hostel:{
        type: String
    },
    branch:{
        type: String
    }, 
    room:{
        type: Number
    },
    gender:{
        type: String
    }
});

//USER WILL HAVE TYPE AND OTHER PROPERTIES LATER
userSchema.plugin(passportLocalMongoose, {usernameField: "email", passwordField: "password"});
mongoose.model("userModel", userSchema);