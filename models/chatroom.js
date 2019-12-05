const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    chatCode: {type: String, required: true},
    userID: [{type: String}],
    userName: [{type: String}],
    exit: {type: Boolean, default: false}
});

const ChatRoom = mongoose.model('chatRoom', ChatRoomSchema);

module.exports = ChatRoom;
