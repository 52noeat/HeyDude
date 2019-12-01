const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatCode : {type: String, required: true},
    userID : {type: String, required: true},
    userName : {type: String, required: true},
    message : {type: String, required: true},
    date: {type: Date, default: Date.now()}
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;
