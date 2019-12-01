const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    chatCode: {type: String, required: true},
    ID1: {type: String, required: true},
    Name1: {type: String, required: true},
    ID2: {type: String, required: true},
    Name2: {type: String, required: true},
    exit: {type: Boolean, default: false}
});

const ChatRoom = mongoose.model('chatRoom', ChatRoomSchema);

module.exports = ChatRoom;
