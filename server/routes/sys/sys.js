var express = require('express');
var router = express.Router();
var mysql1 = require("../mysql-thing");
var mysql = require("../mysql");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");
var md5 = require("../md5.js");
/*部门管理*/
router.get("/selBarInfo", function(req, res) {
	mysql.query("select * from branch", function(err, result) {
		chuli1(err, result, res);
	});
});

router.get("/addBar", function(req, res) {
	mysql.query("insert into branch (bname,bnum) values (?,?)", [req.query.bname, req.query.bnum], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/editBar1", function(req, res) {
	mysql.query("update branch set bstatus=? where bid=?", [req.query.bstatus, req.query.bid], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/editBar2", function(req, res) {
	mysql.query("update branch set bname=? where bid=?", [req.query.bname, req.query.bid], function(err, result) {
		chuli(err, result, res);
	});
});

/*入驻年限管理*/
router.get("/selEmInfo", function(req, res) {
	mysql.query("select * from enter_method order by field (em_n,1,2,3,4,5,6,7,8,9,10,-1)", function(err, result) {
		chuli1(err, result, res);
	});
});

router.get("/addEm", function(req, res) {
	var obj = {
		1: "一年",
		2: "两年",
		3: "三年",
		4: "四年",
		5: "五年",
		6: "六年",
		7: "七年",
		8: "八年",
		9: "九年",
		10: "十年",
	}
	mysql.query("insert into enter_method (em_name,em_n) values (?,?)", [obj[req.query.em_n], req.query.em_n], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/editEm", function(req, res) {
	mysql.query("update enter_method set em_status=? where em_id=?", [req.query.em_status, req.query.em_id], function(err, result) {
		chuli(err, result, res);
	});
});

/*房间类型管理*/
router.get("/selRtInfo", function(req, res) {
	mysql.query("select * from room_type", function(err, result) {
		chuli1(err, result, res);
	});
});

router.get("/addRt", function(req, res) {
	mysql.query("insert into room_type (r_type_name,r_price,bed_n) values (?,?,?)", [req.query.r_type_name, req.query.r_price, req.query.bed_n], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/editRt1", function(req, res) {
	mysql.query("update room_type set r_status=? where rid=?", [req.query.r_status, req.query.rid], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/editRt2", function(req, res) {
	mysql.query("update room_type set r_price=? where rid=?", [req.query.r_price, req.query.rid], function(err, result) {
		chuli(err, result, res);
	});
});

/*日志操作*/
/*按条件 分页查询*/
router.get("/selRzAll", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " (wname like '%" + req.query.like + "%' or cztype like '%" + req.query.like + "%' or uname like '%" + req.query.like + "%')"
	}
	if(req.query.starttime){
		if(like==""){
			like = like+" cztime>'"+time(new Date(parseInt(req.query.starttime)))+"'";
		}else{
			like = like+" and cztime>'"+time(new Date(parseInt(req.query.starttime)))+"'";
		}
	}
	if(req.query.endtime){
		if(like==""){
			like = like+" cztime<'"+time(new Date(parseInt(req.query.endtime)))+"'";
		}else{
			like = like+" and cztime<'"+time(new Date(parseInt(req.query.endtime)))+"'";
		}
	}
	like=like?" where"+like:"";
	var sql = "select * from journal" + like;
	console.log(sql);
	mysql1.getConnection(function(con) {
		con.query(sql, function(err, result) {
			con.release();
			if(err) {
				res.end("1")
			} else {
				res.end((Math.ceil(result.length / 10)).toString());
			}
		});
	});
});

router.get("/selRzPage", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " (wname like '%" + req.query.like + "%' or cztype like '%" + req.query.like + "%' or uname like '%" + req.query.like + "%')"
	}
	if(req.query.starttime){
		if(like==""){
			like = like+" cztime>'"+time(new Date(parseInt(req.query.starttime)))+"'";
		}else{
			like = like+" and cztime>'"+time(new Date(parseInt(req.query.starttime)))+"'";
		}
	}
	if(req.query.endtime){
		if(like==""){
			like = like+" cztime<'"+time(new Date(parseInt(req.query.endtime)))+"'";
		}else{
			like = like+" and cztime<'"+time(new Date(parseInt(req.query.endtime)))+"'";
		}
	}
	like=like?" where"+like:"";
	var sql = "select * from journal" + like + " limit " + req.query.page * 10 + ",10";
	console.log(sql);
	mysql1.getConnection(function(con) {
		con.query(sql, function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});

/*账号管理*/
router.get("/selUserInfo",function(req,res){
	mysql.query("select * from user",function(err,result){
		chuli1(err,result,res);
	});
});

router.get("/editUser1", function(req, res) {
	mysql.query("update user set isDel=? where uid=?", [req.query.isDel, req.query.uid], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/addUser",function(req,res){
	var {upass,wname,ustatus,uname}=req.query;
	mysql.query("insert into user (uname,upass,wname,ustatus) values (?,?,?,?)",[uname*1+1,md5(upass),wname,ustatus],function(err,result){
		console.log(err);
		chuli(err,result,res);
	});
});

router.get("/editUser2", function(req, res) {
	mysql.query("update user set upass=? where uid=?", [md5(req.query.upass), req.query.uid], function(err, result) {
		chuli(err, result, res);
	});
});

router.get("/selWorkerInfo",function(req,res){
	mysql.query("select wname,wnum from worker",function(err,result){
		chuli1(err,result,res);
	});
});
module.exports = router;