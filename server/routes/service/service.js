var express = require('express');
var router = express.Router();
var mysql=require("../mysql-thing.js");
var chuli=require("../chuli.js");
var chuli1=require("../chuli1.js");
var time=require("../time.js");
var rz=require("../rz.js");
router.get('/addSign', function(req, res, next) {
	mysql.getConnection(function(con){
		con.query("insert into service (spos,wnum,reptime,snote) values (?,?,?,?)",[req.query.spos,req.query.wnum,time(new Date()),req.query.snote],function(err,result){
			chuli(err,result,res);
			rz(req,"维修登记");
		});
	});
});

router.get("/selectAll", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " where worker.wname like '%" + req.query.like + "%' and service.sstatus="+req.query.flag+" and worker.wnum=service.wnum";
	}else{
		like = " where service.sstatus="+req.query.flag+" and worker.wnum=service.wnum"
	}
	var sql = "select service.*,worker.wname from service,worker" + like;
	mysql.getConnection(function(con){
		con.query(sql, function(err, result) {
			con.release();
			if(err) {
				res.end("1")
			} else {
				res.end((Math.ceil(result.length / 10)).toString());
			}
		})
	});
});
router.get("/selectPage",function(req,res){
	var like = "";
	if(req.query.like) {
		like = " where worker.wname like '%" + req.query.like + "%' and service.sstatus="+req.query.flag+" and worker.wnum=service.wnum";
	}else{
		like = " where service.sstatus="+req.query.flag+" and worker.wnum=service.wnum"
	}
	var sql = "select service.*,worker.wname from service,worker" + like+" limit "+req.query.page*10+",10";
	mysql.getConnection(function(con){
		con.query(sql, function(err, result) {
			con.release();
			chuli1(err,result,res)
		})
	});
});

/*单条删除*/
router.get("/delSign",function(req,res){
	mysql.getConnection(function(con){
		con.query("delete from service where sid="+req.query.sid,function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});

/*完成*/
router.get("/wc",function(req,res){
	mysql.getConnection(function(con){
		con.query("update service set sstatus=1,fintime"+time(new Date())+" where sid="+req.query.sid,function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});

/*按sid查询*/
router.get("/selBySid",function(req,res){
	mysql.getConnection(function(con){
		con.query("select worker.wnum,service.* from service,worker where service.sid="+req.query.sid,function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});


/*修改*/
router.get("/edit",function(req,res){
	var spos=req.query.spos;
	var wnum=req.query.wnum;
	var snote=req.query.snote;
	mysql.getConnection(function(con){
		con.query("update service set spos=?,wnum=?,snote=? where sid=?",[spos,wnum,snote,req.query.sid],function(err,result){
			chuli(err,result,res);
		});
	});
});
module.exports = router;
