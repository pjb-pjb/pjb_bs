var mysql = require("./mysql");
var time = require("./time");
var ip = require("./ip");
module.exports = function(req,str) {
	var uname=unescape(req.cookies.uname);
	var wname=unescape(req.cookies.wname);
	mysql.query("insert into journal (uname,wname,cztype,cztime,ip) values (?,?,?,?,?)", [uname, wname, str, time(new Date()), ip(req)]);
}