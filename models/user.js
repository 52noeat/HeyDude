const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
    userType: {type: boolean, required: true},
    userID: {type: String, required: true},
    password: {type: String, required: true},
    userName: {type: String, required: true}
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
