var mongoose = require("mongoose");
//import/initialize passport local mongoose
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});



//use passport local monoose 
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);