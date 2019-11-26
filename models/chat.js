const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatCode: {type: String, required: true},
    ID1: {type: String, required: true},
    Name1: {type: String, required: true},
    ID2: {type: String, required: true},
    Name2: {type: String, required: true},
    exit: {type: Boolean, default: false},
    contents : [
        new mongoose.Schema({
            userID: {type: String, required: true},
            content: {type: String, required: true},
            read: {type: String, default: false}
        })
    ]
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;
