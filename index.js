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

function threadCheckTime() {
    var timeNow = new Date().toLocaleString({ timeZone: 'Asia/Jakarta' });
    var date = timeNow.split(" ")[0].replace(",","").split("/");
    var time = timeNow.split(" ")[1].split(":");
    var time2 = timeNow.split(" ")[2].toLowerCase();
    var m = date[0];
    if(m.length == 1)
    {
        m = "0"+m;
    }
    var dd = date[1];
    if(dd.length == 1)
    {
        dd = "0"+dd;
    }
    var yy = date[2];
    var mm = time[1];
    if(mm.length == 1)
    {
        mm = "0"+mm;
    }
    var ss = time[2];
    var hh = time[0];
    // if(time2 == 'AM') {
    //     var hh = time[0];
    //     if(hh == 12) {
    //         hh = 0;
    //     }
    // } else {
    //     var hh = 1*time[0]+12;
    // }
    console.log(`Time is ${dd}/${m}/${yy} ${hh}:${mm}:${ss}${time2}`);
    return `${dd}/${m}/${yy} ${hh}:${mm}${time2}`;
}

app.get('/', function (req, res) {
    console.log("ABC");
    res.writeHead(250, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify({status: 250 ,data: true}));
});

app.post('/insertqueue', function (request, response) {
    queueController.saveToQueue(request,response);
});

app.get('/send', function (req, res) {
    queueController.sendMail('896365928');
    res.writeHead(250, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify({status: 250 ,data: true}));

});

app.listen( process.env.PORT || 3000, ()=>{
    setInterval(()=>{
        queueController.sentDelayTime(threadCheckTime());
    },60000);
    console.log("server is running port 3000 and run thread");
});





