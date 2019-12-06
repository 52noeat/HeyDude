const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    userName: {type: String, required: true},
    sex: {type: String, required: true},
    age: {type: String, required: true},
    major: {type: String, required: true},
    nationality: {type: String, required: true},
    tendency: {type: String, required: true},
    language: [{type: String}],
    level: [{type: String}],
    interest: {type: String, required: true},
    hate: {type: String, default: ""},
    wish: {type: String, default: ""},
    introduce: {type: String, default: ""},
    active: {type: Boolean, default: true},
    friend: [{type: String}],
    plus: [{type : String}],
    block: [{type : String}],
    url: [{type : String, default: ""}]
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;
