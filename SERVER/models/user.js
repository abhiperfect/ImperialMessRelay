const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate");

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
    profilephoto:{
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
    },
    googleId:{
        type: String
    },
    state:{
        type: String
    }
}, { strictQuery: false });

//USER WILL HAVE TYPE AND OTHER PROPERTIES LATER
userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
userSchema.plugin(findOrCreate);
mongoose.model("userModel", userSchema);