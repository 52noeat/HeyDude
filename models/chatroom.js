const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    chatCode: {type: String, required: true},
    userID: [{type: String}],
    userName: [{type: String}],
    url: [{type: String}],
    exit: {type: Boolean, default: false},
    message : {type: String, default: ""},
    date: {type: String, default: ""},
    read: {type: Number, default: 0}
});

const ChatRoom = mongoose.model('chatRoom', ChatRoomSchema);

module.exports = ChatRoom;
