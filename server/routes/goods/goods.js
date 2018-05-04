var express = require('express');
var router = express.Router();
var mysql = require("../mysql.js");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var db=require("../mysql-thing.js");
var time=require("../time.js");
var async = require("async");
/* 单条添加*/
router.get('/addSign', function(req, res, next) {
	db.getConnection(function(con){
		/*开启事务*/
		con.beginTransaction(function(err){
			if(err){
				res.end("err");
				return;
			}
			var gname = req.query.gname;
			var gnum = req.query.gnum;
			var gamount = req.query.gamount;
			var eprice = req.query.eprice;
			async.parallel([function(next) {
				con.query("insert into goods (gname,gnum,gamount) values (?,?,?)", [gname, gnum, gamount], function(err, result) {
					next(err,result);
				});
			}, function(next) {
				con.query("insert into egoods (gnum,eamount,etime,eprice) values (?,?,?,?)",[gnum,gamount,time(new Date()),eprice],function(err,result){
					next(err,result);
				});
			}], function(err,results) {
				if(err){
					con.rollback(function(){
						con.rollback();
						con.release();
						res.end("err");
					});
				}else{
					con.commit(function(err){
						if(err){
							res.end("err");
						}else{
							if(results[0].affectedRows>0&&results[1].affectedRows>0){
								res.end("ok");
							}else{
								res.end("err");
							}
						}
						con.release();
					});
				}
			});		
		})
	});
});

/*单条删除*/
router.get("/delSign", function(req, res) {
	mysql.query("delete from goods where gid=" + req.query.gid, function(err, result) {
		chuli(err, result, res);
	});
});

/*修改*/
router.get("/edit", function(req, res) {
	var gname = req.query.gname;
	var gnum = req.query.gnum;
	var gid = req.query.gid;
	mysql.query("update goods set gname=?,gnum=? where gid=?", [gname, gnum, gid], function(err, result) {
		chuli(err, result, res);
	});
});

/*分页  按条件查询*/
router.get("/selectAll", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " where gname like '%" + req.query.like + "%' or gamount like '%" + req.query.like + "%'";
	}
	var sql = "select * from goods" + like;
	mysql.query(sql, function(err, result) {
		if(err) {
			res.end("1")
		} else {
			res.end((Math.ceil(result.length / 10)).toString());
		}
	})
});

router.get("/selectPage", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " where gname like '%" + req.query.like + "%' or gnum like '%" + req.query.like + "%'";
	}
	var sql = "select * from goods" + like + " limit " + parseInt(req.query.page * 10) + ",10";
	mysql.query(sql, function(err, result) {
		chuli1(err, result, res);
	});
});


/*查询*/
router.get("/selectByGid",function(req,res){
	db.getConnection(function(con){
		con.query("select * from goods where gid="+req.query.gid,function(err,result){
			chuli1(err,result,res);
		});
	});
});

/*添加库存*/
router.get("/addNum",function(req,res){
	db.getConnection(function(con){
		con.beginTransaction(function(err){
			if(err){
				res.end("err");
				return;
			}
			var gid=req.query.gid;
			var gnum=req.query.gnum;
			var gamount=req.query.gamount;
			var eamount=req.query.eamount;
			async.auto({
				getPrice:function(next){
					con.query("select eprice from egoods where gnum="+gnum,function(err,result){
						console.log(result);
						next(err,result[0].eprice);
					});
				},
				addNum:function(next){
					con.query("update goods set gamount="+gamount+" where gid="+req.query.gid,function(err,result){
						next(err,result);
					})
				},
				addEgoodsInfo:["getPrice",function(result,next){
						console.log(result.getPrice);
						con.query("insert into egoods (gnum,eamount,etime,eprice) values (?,?,?,?)",[gnum,eamount,time(new Date()),result.getPrice],function(err,result){
						next(err,result);
					});
				}]
			},function(err,results){
				console.log(results);
				if(err){
					con.rollback(function(){
						con.release();
						res.end("err");
					});
				}else{
					con.commit(function(err){
						if(err){
							res.end("err");
						}else{
							if(results.addNum.affectedRows>0&&results.addEgoodsInfo.affectedRows){
								res.end("ok");
							}else{
								res.end("err");
							}
						}
						con.release();
					});
				}
			});
		});
	});
});






module.exports = router;