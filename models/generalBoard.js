var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generalCommentSchema = new Schema({
    contents: String,
    userid: String,
    userName: String,
    time: String,
    date: String,
    comment_date: {type: Date, default: Date.now()}
});

var generalBoardSchema = new Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    author: String,
    board_date: {type: Date, default: Date.now()},
    userName: {type: String},
    userid: String,
    time: String,
    date: String,
    url: [{type : String, default: ""}],
    view_num: {type: Number, default:0},
    comments: [generalCommentSchema]
});

module.exports = mongoose.model('generalBoard', generalBoardSchema);