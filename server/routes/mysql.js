var mysql=require("mysql");
var con=mysql.createConnection({
	host:"localhost",
	port:"3306",
	user:"root",
	password:"MyNewPassword",
	database:"bs",
	timezone:"HH:MM"
})
module.exports=con;