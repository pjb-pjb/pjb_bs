var express = require('express');
var router = express.Router();
var mysql=require("../mysql-thing.js");
var chuli=require("../chuli.js");
var chuli1=require("../chuli1.js");
var async=require("async");

/* GET home page. */
router.post('/addBed', function(req, res, next) {
	var hnum=req.body.hnum;
	var hname=req.body.hname;
	var height=req.body.height;
	var bedinfo=req.body.bedinfo;
	var rid=req.body.rid;
	console.log(rid);
	mysql.getConnection(function(con){
		con.query("insert into hours (hnum,hname,height,bedinfo,rid) values (?,?,?,?,?)",[hnum,hname,height,bedinfo,rid],function(err,result){
			console.log(err);
			con.release();
			chuli(err,result,res);
		});
	});
});

router.get("/select",function(req,res){
	mysql.getConnection(function(con){
		con.query("select hours.*,room_type.* from hours,room_type where hours.rid=room_type.rid and hstatus=0",function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

router.get("/selectInfo",function(req,res){
	mysql.getConnection(function(con){
		async.parallel([function(next){
			con.query("select wnum,wname from worker where wstatus=0",function(err,result){
				next(err,result);
			});
		},function(next){
			con.query("select * from hours",function(err,result){
				next(err,result);
			});
		}],function(err,results){
			con.release();
			if(err){
				res.end(JSON.stringify({message:"info"}));
			}else{
				var obj={};
				obj.workerDatas=results[0];
				obj.posDatas=results[1];
				res.end(JSON.stringify(obj));
			}
		});
	});
});

router.get("/selectRtype",function(req,res){
	mysql.getConnection(function(con){
		con.query("select rid,r_type_name from room_type",function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

module.exports = router;
