var db    = {};  
var mysql = require('mysql');  
var pool  = mysql.createPool({  
  connectionLimit : 10,  
  host            : 'localhost',  
  user            : 'root',  
  password        : 'MyNewPassword',  
  database        : 'bs',
  timezone:"HH:MM"
});  
//获取连接  
db.getConnection = function(callback){  
    pool.getConnection(function(err, connection) {  
        if (err) {  
            callback(null);  
            return;  
        }  
        callback(connection);  
    });  
}   
module.exports = db; 