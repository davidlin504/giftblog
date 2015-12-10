
/**
	* Node.js Login Boilerplate
	* More Info : http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/
	* Copyright (c) 2013-2015 Stephen Braitsch
**/



var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var fs = require('fs');
var busboy = require('connect-busboy');
var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dif66eh4c', 
  api_key: '261139379512132', 
  api_secret: 'EAWNq69v8vgYUEhSJsbGkXd5Yjw' 
});






var app = express();
app.use(busboy()); 


//




//
//middleware
// tell express to use the bodyParser middleware                                                 
// and set upload directory                                                                      
// app.use(express.bodyParser({ keepExtensions: true, uploadDir: "uploads" }));                     
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "127.0.0.1");
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ host: 'localhost',port: 27017,db: 'node-login'})
	})
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));


require('./app/server/routes')(app);

if (app.get('env') == 'development') app.use(errorHandler());

http.createServer(app).listen(app.get('port'),app.get('ip'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
