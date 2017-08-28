const queueModel = require('../model/queueModel');
const fs         = require('fs');
const mailling   = require('../config');

var controller = {};


const saveQueue = function (postParse,queueId,fileNameSend,fileNameServer) {
    return new Promise(function (resolve, reject) {
        var count = 0;
        for(var item of postParse){
            var data = item;

            data.fileNameSend = fileNameSend;
            data.fileNameServer = fileNameServer;
            data.isSend = false;
            data.queueId = queueId;
            queueModel.add(data)
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


const count = function(){
    var c= 0;
    for(var p in this) if(this.hasOwnProperty(p))++c;
    return c;
};


controller.saveToQueue = function (request,response) {
    var postParam = request.body.data;
    var queueId = Math.floor((Math.random() * 1000000000) + 1);
    var postParse = JSON.parse(postParam);

    var fileNameSend = [];
    var fileNameServer = [];

    console.log(count.call(request.files));
    console.log(request.files);
    if(request.files){
        const countFile = count.call(request.files);
        const file = request.files;

        if(countFile >= 1){
            for(var i = 0;i < countFile;i++){
                var fileServer = Math.floor((Math.random() * 1000000000) + 1)+getTypeFile(file[i].name);

                fileNameServer.push(fileServer);
                fileNameSend.push(file[i].name);
                file[i].mv('./fileupload/'+fileServer, function(err) {
                    if (!err)
                        console.log('upload success');
                });
            }
        }
    }

    saveQueue(postParse,queueId,fileNameSend,fileNameServer)
        .then(function (res) {

            if(postParse[0].timeToSent == ''){
                console.log("Success added queue, start sent mail to queue",res);
                controller.sendMail(res);
            } else {
                console.log("Success added queue, start sent mail ",postParse[0].timeToSent);
            }

            response.writeHead(201, { 'Content-Type': 'text/plain' });
            response.end(JSON.stringify({status: 201 ,data: res}));
        })
        .catch(function (err) {
            console.log(err);
        });
};

controller.sentDelayTime = function (datetime) {
    queueModel.getQueueByTime(datetime)
        .then(function (listQueue) {
            if(listQueue[0] != undefined){
                sentMail(listQueue);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
};

controller.sendMail = function (queueId) {
    queueModel.getListByQueueId(queueId)
        .then(function (listQueue) {
            if(listQueue[0] != undefined){
                sentMail(listQueue);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

function sentMail(listQueue) {
    if(listQueue){
        var attachments = [];
        var lent = listQueue[0].fileNameSend.length || 0;
        for(var i=0;i<lent;i++){
            attachments.push({filename: listQueue[0].fileNameSend[i], content: fs.readFileSync('./fileupload/'+listQueue[0].fileNameServer[i])});
        }

        var arrayId = [];
        for(item of listQueue) arrayId.push(item._id);
        queueModel.updateSend(arrayId)
            .then(function (res) {
            });

        for(item of listQueue){
            var mailOptions = {
                from: 'support@safsa.vn', // sender address
                // from: 'vule.ask@gmail.com', // sender address
                to: item.to, // list of receivers
                subject: item.subject, // Subject line
                text: item.text, // plain text body
                html: item.html, // html body,
                replyTo: item.replyTo,
                cc: item.cc,
                bcc: item.bcc,
                attachments: attachments
            };

            mailling.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email send '+ info.response);

                }
            });
        }//end for
    }
}

module.exports = controller;