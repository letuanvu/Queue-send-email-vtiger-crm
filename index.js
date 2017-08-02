var finalhandler = require('finalhandler');
var http         = require('http');
var express      = require('express');
var mailling     = require('./config');
var bodyParser   = require('body-parser');
const fileUpload = require('express-fileupload');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());


app.post('/insertqueue', function (req, res) {
    console.log(req.body);
    console.log(req.files);

    if(req.files){
        var attachments = req.files.attachments;
        attachments.mv('./fileupload/'+attachments.name, function(err) {
            if (!err)
                res.end('File uploaded!');
        });
    }

});

app.get('/send', function (req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('oke');

    var sendTo = ['ltvu.59@gmail.com'
    ];


    var len = sendTo.length;
    for(var i = 0;i < len;i++){

        var mailOptions = {
            from: 'support@safsa.vn', // sender address
            to: sendTo[i], // list of receivers
            subject: 'Test send email', // Subject line
            text: 'Mời bạn xem file đính kèm', // plain text body
            html: '<b>Hello world ?</b>', // html body,
            // replyTo: 'huu.phuong195@gmail.com',
            // cc: 'liemnguyen.ask@gmail.com, phuongtran2.ask@gmai.com, vule.ask@gmail.com',
            // bcc: 'zovanser@gmail.com',
            // attachments: [
            //     {
            //         filename: 'virus.zip',
            //         content: fs.createReadStream('attch.zip'),
            //     }
            // ]
        };

        mailling.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {

                console.log('Email sent '+ info.response);
            }
        });
    }

});

app.listen( process.env.PORT || 3000, console.log("server is running port 3000"));





