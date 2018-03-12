var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var axios = require("axios");
var parser = require('ua-parser-js');
var admin = require('firebase-admin');

var dbConfig = require('./app/config/database.config.js');
var mongoose = require('mongoose');


mongoose.connect(dbConfig.url);
mongoose.connection.on('error', function(err) { console.log(err);
    process.exit();
});
mongoose.connection.once('open', function() { console.log("Successfully connected to the database");
});


var app = express();

var serviceAccount = {
    "type": "service_account",
    "project_id": "b2c-network",
    "private_key_id": "00fad73e0326bd8232992d58ce1e034642515ef6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdMmGYY2aWjxKn\nWmFOVPmCdCXoDx6+ca+HxQY3C1epRBBW3KFyEMhKAFujWjAveOaGYrzapIhb5OdX\nXLh8Xspq660pzlG0Xvod6Y2Iwh2R1HobW2VLB1VT1d/7wIMwVu0RUWLQQ9HgGfiI\ndVuW79aLhh/b4vZrpes3GkIGCcpEOl5N0AwjdDb1ozFZ788pTlTAA0aKwZNm9m03\ndXy5aKnKvX3rzz7T2WoaUf4QntK9NY2Z5JwCNVmzkB8u1MG5XcdLpA2eVpZ4UypD\nrDQTf1i9n5htpZRu1hlCVEi4JJ1Y/NERM7ulX/MyuAupLMj5zrJfECGeGKITUin5\nH1GYdIBtAgMBAAECggEAQzgoSHMMnfxkos7oezF/kZFSY68UnLNXsF7DgL7FqP6y\nKHNr7IoFE9gAAShLNGH9TCF9WsRdW++4Dehzd/gmc0+jk+zLD5E9WRG8nS7AZay4\nXs/rfF2CJLP+GTdrpqkD6htdeATkJsI9sNpZNwkznbrou53BXP1S+a/VGJipCwpR\nKntm4CrBYO+ilX9DrnFDoOeqQxOhmVSkBu3HhHerBDZjH18qBheM4QlTHIEEIO64\nQNJidaxc3cV0USmUgzTBHcYGpt2BJ959WD0gFy6EG1bh3bqAFmB0+pqvvqZcCGLP\n2M38uDgCY7IVAmJGNKshgVaPaG+G+kQlMCHrEGuuUQKBgQDznWjOe4zW/e8V7gbB\nngA7xdGtyQ37M8G3HMusP0QFreJ2gvhxoJFuDigM60rN0zGPDf0AbHhhdAwKJwV+\nquxrL7uopsyelgdonl3u3cGiJDr83zmPFhJ7NC0rDzB3iFlwMCLdU345Z6FSSf0p\nynB9T/Btnv6XqpNTRxTOxMzhbwKBgQDocTSud88WMI56EFCW59d0UMmKoijDRjN1\nvKbaKnV5O70P3txWKAA4m6MtywpH1SfQ5SD/R5nfFAol6afN67iD7INoc6evutAj\nCztYVSyTQKl9UN9S0b0ls97lzhmywyFyhQ8m8TXcMcKmZLJdcAg2PFFPVkPzw1oE\n3QlJkh2V4wKBgCJE21BoethnYjGAiTzFQB0oZ6V9qdTTZAWhLFlvkN8Hpdqr88zw\nHGUR4rpmguBPPCJ2gkeD+q8ixurKsHAwFQ/C6DACPrh0PFiQJoCKe0mWtSGLOSqS\nnUjtfwkWmufFq2cnrk/aBeCHXl8X/1/YlVhbXWPeQMwO96h4UEoBzxxLAoGAJYj6\nX94bA9NNfqqZyPShVzggg5GSEY6Jis6vBvXqSGx8KE7tt7/34SxI2oE6JMVoC5Sk\nknSmhV6AEQU9QsR45FzSD5D1mCwLpk0PBUGj1BeSBxmDJqWV7LuyF9wDTFm0UgDo\npHo5H1itvR7vqqUHvnJZEv20NW3rYHOtJ0NAIc8CgYEAuWlIfJtPSVx+CbFHDNgF\nUkqDQb+USR/ZE+y1FCz22EwdcvZ1GPaYbZPLcRvuhRrFhFOVQamqvzhgSOc1beBu\nNTZoZNVAvwGjmxY2KqEm1lYBhiQ0Y8PFcFJsrdR3K4O5upnv+ibNTmwPbgPIfJe9\nbDCI6LNgMNInDuX9Eykhkg8=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fxm7d@b2c-network.iam.gserviceaccount.com",
    "client_id": "115353566963182057554",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fxm7d%40b2c-network.iam.gserviceaccount.com"
  };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://b2c-network.firebaseio.com/'
  });




//create a cors middleware
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// require('./app/others/schedule.js')(app);

require('./app/routes/Search.routes.js')(app);

require('./app/routes/SignInSignUp.routes.js')(app);

require('./app/routes/Follow.routes.js')(app);

require('./app/routes/Topics.routes.js')(app);

require('./app/routes/HighlightsPost.routes.js')(app);

require('./app/routes/QuestionsPost.routes.js')(app);

require('./app/routes/FileUpload.routes.js')(app);

require('./app/routes/LikeAndRating.routes.js')(app);

require('./app/routes/CommentAndAnswer.routes.js')(app);

require('./app/routes/Trends.routes.js')(app);

require('./app/routes/profile.routes.js')(app);

require('./app/routes/ReportAndDelete.routes.js')(app);

app.use('/static', express.static('uploads'));

app.get('/SendMessages', function(req, res){
  var registrationToken = 'fJrhOSiioCs:APA91bFxRHA8BGiTx-JyhoHuLXA6CuueDWh6wNodI9S3NNC0UNgjuGTzHVB1xikPX6ZuhhZM8iXcOiQC-GUvMLC0seETxwl5KAyj09E-uGBzcse4al4zygZ7cmL3BVGXlozOsA2VPt7g';

    var payload = {
        notification: {
            title: 'B2C Networks',
            body: 'First Push Notification Test',
            icon: 'stock_ticker_update',
            color: '#f45342'
        }
      };
      
      var options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24
      };

      admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(response) {
          console.log('Successfully sent message:', response);
          res.send(response);
        })
        .catch(function(error) {
          console.log('Error sending message:', error);
          res.send(error);
        });
});

// app.get('*', function(req, res, next){
//     var DeviceInfo = parser(req.headers['user-agent']);
//     if(DeviceInfo.os.name === 'Andorid') {
//         res.redirect(301, 'https://www.google.com' );
//     } else {
//         next();
//     }
// });

app.use(express.static(__dirname + '/view/dist/'));

app.use(function(req, res) {
     res.sendFile(path.join(__dirname, '/view/dist', 'index.html'));
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
