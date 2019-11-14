const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    KID: {type: String, required: true},
    KName: {type: String, required: true},
    FID: {type: String, required: true},
    FName: {type: String, required: true},
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
