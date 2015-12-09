var http = require("http");
var moment = require("moment");

var server = http.createServer(function(req, res) {

  var now = moment(new Date());

  var date = now.format("D MMM YYYY");
  var year = now.format("YYYY");
  var month = now.format("MMMM");
  var time = now.format("HH:mm");
  var stdtime=moment().format("YYYY/MM/D")

  res.write("<p>Today's date is " + date + "</p>");
  res.write("<p>The year is " + year + "</p>");
  res.write("<p>The month is " + month + "</p>");
  res.write("<p>The time is " + time + "</p>");
  res.write(stdtime);

  res.end();

}).listen(8080);