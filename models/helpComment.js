var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var helpCommentSchema = new Schema({
    contents: String,
    userName: String,
    time: String,
    date: String,
    comment_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('helpComment', helpCommentSchema);