const Chat = require('./chat');
const FriendList = require('./friendlist');
const Profile = require('./profile');
const User = require('./user');
const generalBoard = require('./generalBoard');
const generalComment = require('./generalComment');
const semesterBoard = require('./semesterBoard');
const semesterComment = require('./semesterComment');
const helpBoard = require('./helpBoard');
const helpComment = require('./helpComment');

module.exports = {
    User,
    Profile,
    FriendList,
    Chat,
    generalBoard,
    generalComment,
    semesterBoard,
    semesterComment,
    helpBoard,
    helpComment
}

