var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

AdminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Admin", AdminSchema);