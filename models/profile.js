const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userType: {type: Number, required: true},
    userID: {type: String, required: true},
    userName: {type: String, required: true},
    birth: {type: String, required: true},
    nationality: {type: String, required: true},
    language: {type: String, required: true},
    goal: {type: String, required: true},
    wish: {type: String, required: false},
    introduce: {type: String, required: false}
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;
