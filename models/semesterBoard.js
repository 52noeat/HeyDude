var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var semesterCommentSchema = new Schema({
    contents: String,
    userName: String,
    userid: String,
    time: String,
    date: String,
    comment_date: {type: Date, default: Date.now()}
});

var semesterBoardSchema = new Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    author: String,
    board_date: {type: Date, default: Date.now()},
    userName: {type: String},
    userid: String,
    time: String,
    date: String,
    view_num: {type: Number, default:0},
    url: {type : String, default: ""},
    like: { type: Number, default: 0 },
    comments: [semesterCommentSchema],
    semester: String
});

module.exports = mongoose.model('semesterBoard', semesterBoardSchema);