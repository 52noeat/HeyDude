const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const FriendListSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    userType: {type: boolean, required: true},
    password: {type: String, required: true},
    userName: {type: String, required: true},
    friendList : [
        new mongoose.Schema({
            userID: {type: String, required: true},
            userName: {type: String, required: true},
            birth: {type: String, required: true},
            nationality: {type: String, required: true}
        })
    ]
});

const FriendList =  mongoose.model('friendList', FriendListSchema);

module.exports = FriendList;
