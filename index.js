const fs = require('fs');
const http         = require('http');
const express      = require('express');
const mailling     = require('./config');
const bodyParser   = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose     = require('mongoose');
const queueSchema  = require('./model/queue');
const queueController = require('./model/queueController');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

mongoose.Promise = global.Promise;
const connect = mongoose.connect('mongodb://localhost:27017/queue-email',{
    useMongoClient: true
});

connect.then(function () {
    console.log("connected mongodb");
});

const saveQueue = function (postParse,queueId,fileNameSend,fileNameServer) {
    return new Promise(function (resolve, reject) {
        var count = 0;
        for(var item of postParse){
            var data = item;
            data.fileNameSend = fileNameSend;
            data.fileNameServer = fileNameServer;
            data.isSend = false;
            data.queueId = queueId;
            queueController.add(data)
                .then(function (resController) {
                    console.log(resController);
                    count++;
                    if(count == postParse.length){
                        resolve(queueId);
                    }
                })
                .catch(function (errController) {
                    console.log(errController);
                });
        }

    })
};

const getTypeFile = function (fileName) {
    var name = fileName.split('.');
    return '.'+name[name.length-1];
};

app.post('/insertqueue', function (request, response) {
    var postParam = request.body.data;
    var queueId = Math.floor((Math.random() * 1000000000) + 1);
    var postParse = JSON.parse(postParam,queueId);

    var fileNameSend = '';
    var fileNameServer = '';

    if(request.files.attachments){
        var attachments = request.files.attachments;
        fileNameServer = queueId+getTypeFile(request.files.attachments.name);
        fileNameSend = attachments.name;
        attachments.mv('./fileupload/'+fileNameServer, function(err) {
            if (!err)
                console.log('upload success');
        });
    }

    saveQueue(postParse,queueId,fileNameSend,fileNameServer)
        .then(function (res) {
            console.log("success add queue",res);

            response.writeHead(201, { 'Content-Type': 'text/plain' });
            response.end(JSON.stringify({status: 201 ,data: res}));
        })
        .catch(function (err) {
            console.log(err);
        });


});

app.get('/send', function (req, res) {



    queueController.getListByQueueId('668232293')
        .then(function (listQueue) {
            console.log(listQueue);
            for(item of listQueue){

                var mailOptions = {
                    from: 'support@safsa.vn', // sender address
                    to: item.to, // list of receivers
                    subject: item.subject, // Subject line
                    text: item.text, // plain text body
                    html: item.html, // html body,
                    replyTo: item.replyTo,
                    cc: item.cc,
                    bcc: item.bcc,
                    attachments: [
                        {
                            filename:  item.fileNameSend,
                            content: fs.createReadStream('./fileupload/'+item.fileNameServer)
                        }
                    ]
                };

                mailling.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {

                        console.log('Email sent '+ info.response);
                    }
                });
            }
        })
        .catch(function (err) {
           console.log(err);
        });



    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('oke');

});

app.listen( process.env.PORT || 3000, console.log("server is running port 3000"));





