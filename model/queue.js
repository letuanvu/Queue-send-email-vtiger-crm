const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const queueSchema = new Schema({
    queueId:  String,
    to:  String,
    subject: String,
    text:   String,
    html:   String,
    replyTo: String,
    cc: String,
    bcc: String,
    timeToSent: String,
    fileNameSend: [String],
    fileNameServer: [String],
    emailId: Number,
    isSend: Boolean,
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

const Queue = mongoose.model('queue', queueSchema);

module.exports = Queue;