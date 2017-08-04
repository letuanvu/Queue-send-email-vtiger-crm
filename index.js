const express      = require('express');
const bodyParser   = require('body-parser');
const fileUpload   = require('express-fileupload');
const mongoose     = require('mongoose');
const queueModel   = require('./model/queueModel');
const queueController   = require('./controller');

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

app.post('/insertqueue', function (request, response) {
    queueController.saveToQueue(request,response);
});

app.get('/send', function (req, res) {
    queueController.sendMail('896365928');
    res.writeHead(250, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify({status: 250 ,data: true}));

});

app.listen( process.env.PORT || 3000, console.log("server is running port 3000"));





