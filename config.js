var nodemailer   = require('nodemailer');


var transporter = nodemailer.createTransport({
    host: '',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '',
        pass: ''
    }
});

module.exports = transporter;