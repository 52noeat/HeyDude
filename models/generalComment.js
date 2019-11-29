var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generalCommentSchema = new Schema({
    contents: String,
    userName: String,
    time: String,
    comment_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('generalComment', generalCommentSchema);