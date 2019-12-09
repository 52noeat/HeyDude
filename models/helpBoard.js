var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var helpCommentSchema = new Schema({
    contents: String,
    userName: String,
    userid: String,
    time: String,
    date: String,
    comment_date: {type: Date, default: Date.now()}
});

var helpBoardSchema = new Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    author: String,
    board_date: {type: Date, default: Date.now()},
    userName: {type: String},
    userid: String,
    time: String,
    date: String,
    url: [{type : String, default: ""}],
    like: { type: Number, default: 0 },
    view_num: {type: Number, default:0},
    comments: [helpCommentSchema]
});

module.exports = mongoose.model('helpBoard', helpBoardSchema);