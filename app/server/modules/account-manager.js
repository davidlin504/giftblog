
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'count';



/* establish the database connection */

// var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
// 	db.open(function(e, d){
// 	if (e) {
// 		console.log(e);
// 	}	else{
// 		console.log('connected to database :: ' + dbName);
// 	}
// });
// var accounts = db.collection('accounts');

// var products = db.collection('products');
//  the second api


MongoClient.connect("mongodb://localhost:27017/"+dbName, {native_parser:true}, function(err, db) {
    

console.log('connected to database :: ' + dbName);

  accounts = db.collection('accounts');

	 products = db.collection('products');

//  the second api
});





/* login validation methods */





exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}




exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.uploader=function(file,callback){

cloudinary.uploader.upload(file, function(result) { 
  console.log(result) 
});


}


exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}

// import single row 10/15

exports.addinfo=function(newData, callback){

accounts.insert(newData, {safe: true}, callback);

}
//

exports.addproduct=function(newData, callback){

products.insert(newData, {safe: true}, callback);

}

exports.addone = function(title,callback)
{

products.update(
	{title:title},{$inc:{count:1}},{multi:true} ,function(e,o){

	callback(e,o);
});

}

exports.addshare = function(title,callback)
{

products.update(
	{title:title},{$inc:{share:1}},{multi:true} ,function(e,o){

	callback(e,o);
});

}







exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		o.userurl   = newData.userurl;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updateproduct = function(id,newData, callback)
{   
	products.findOne({_id: getObjectId(id)}, function(e, o){
		o.title 	= newData.title;
		o.content 	= newData.content;
		o.vurl 	= newData.vurl;
		o.iurl 	= newData.iurl;
		o.lurl  = newData.linkurl;
		o.time  = newData.time;
		if (newData.pass == ''){
			products.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				products.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.upx = function(id, callback)
{
	products.findOne({_id: getObjectId(id)}, function(e, o){
	callback(e,o);
	});
}










exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}


exports.deleteproduct = function(id, callback)
{
	products.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.getproductRecords = function(callback)
{
	products.find().sort(sort = {'_id': -1}
).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};




exports.getproduct= function(post,callback)
{
	products.find({post:post}).sort(sort = {'count': -1}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.getproductshare= function(post,callback)
{
	products.find({post:post}).sort(sort = {'share': -1}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};







exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

exports.delAllProductsRecords = function(callback)
{
	products.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
