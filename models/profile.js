const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    userType: {type: boolean, required: true},
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
