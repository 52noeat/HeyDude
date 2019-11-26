const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const RequestSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    userName: {type: String, required: true},
    friendID: {type: String, required: true}
});

const Request =mongoose.model('request', RequestSchema);

module.exports = Request;
