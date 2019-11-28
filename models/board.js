var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    userName: String,
    MM_DD: String,
    HH_mm: String,
    comment_date: {type: Date, default: Date.now()}
});

var boardSchema = new Schema({
    title: {type: String, required: true},
    contents: {type: String, required: true},
    author: String,
    board_date: {type: Date, default: Date.now()},
    userName: {type: String},
    MM_DD: String,
    HH_mm: String,
    view_num: {type: Number, default:0},
    comments: [commentSchema]
});

module.exports = mongoose.model('board', boardSchema);