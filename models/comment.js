var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    userName: String,
    MM_DD: String,
    HH_mm: String,
    comment_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('comment', commentSchema);