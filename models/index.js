const Chat = require('./chat');
const ChatRoom = require('./chatroom');
const FriendList = require('./friendlist');
const Profile = require('./profile');
const User = require('./user');
const generalBoard = require('./generalBoard');
const generalComment = require('./generalComment');
const semesterBoard = require('./semesterBoard');
const semesterComment = require('./semesterComment');
const helpBoard = require('./helpBoard');
const helpComment = require('./helpComment');
const Request = require('./request');

module.exports = {
    User,
    Profile,
    FriendList,
    Request,
    ChatRoom,
    Chat,
    generalBoard,
    generalComment,
    semesterBoard,
    semesterComment,
    helpBoard,
    helpComment
}

