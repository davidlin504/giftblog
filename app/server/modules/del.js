
var fs=require('fs');


// fs.unlink('./uploads/01.png',function(err){
// if(err)
// 	throw err;

// console.log('done /uploads')
// });

exports.readdir=function(callback){

fs.readdir('./app/public/files',function(err,files){

//console.log(files);
callback(err,files);
// for (var index in files){
// 	console.log(files[index]);}
});
}


exports.unlink=function(){

fs.unlink(url,function(err){



	callback(err)
});


}



