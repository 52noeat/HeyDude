const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    password: {type: String, required: true},
    userName: {type: String, required: true},
    sex: {type: String, required: true},
    verification: {type: String, required: true},
    active: {type: Boolean, required: false}
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
