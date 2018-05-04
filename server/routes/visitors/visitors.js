var express = require('express');
var router = express.Router();
var mysql=require("../mysql.js");
var chuli=require("../chuli.js");
var chuli1=require("../chuli1.js");

/*单条添加信息*/
router.get('/addSign', function(req, res, next) {
	var visname=req.query.visname;
	var certype=req.query.certype;
	var cernum=req.query.cernum;
	var vistime=req.query.vistime;
	var leatime=req.query.leatime;
	var because=req.query.because;
	var note=req.query.note;
	mysql.query("insert into visitors (visname,certype,cernum,vistime,leatime,because,note) values (?,?,?,?,?,?,?)",[visname,certype,cernum,vistime,leatime,because,note],function(err,result){
		console.log(err);
		chuli(err,result,res);
	});
});

/*分页  按条件  查询*/
router.get("/selectAll",function(req,res){
	var like="";
	var sql="";
	if(req.query.like){
		like=" where visname like '%"+req.query.like+"%' or cernum like '%"+req.query.like+"%'";
	}
	sql="select * from visitors"+like;
	mysql.query(sql,function(err,result){
		console.log(err);
		if(err){
			res.end("1");
		}else{
			res.end((Math.ceil(result.length/10)).toString());
		}
	});
});
router.get("/selectPage",function(req,res){
	var like="";
	var sql="";
	if(req.query.like){
		like=" where visname like '%"+req.query.like+"%' or cernum like '%"+req.query.like+"%'";
	}
	sql="select * from visitors"+like+" limit "+parseInt(req.query.page)*10+",10";
	console.log(sql);
	mysql.query(sql,function(err,result){
		chuli1(err,result,res);
	});
});

/*单条删除信息*/
router.get("/delSign",function(req,res){
	mysql.query("delete from visitors where vid="+req.query.vid,function(err,result){
		chuli(err,result,res);
	});
});

/*批量删除信息*/
router.get("/delMore",function(req,res){
	mysql.query("delete from visitors where vid in ("+req.query.vids+")",function(err,result){
		chuli(err,result,res);
	});
});


/*修改信息*/
router.get("/selectByVid",function(req,res){
	mysql.query("select * from visitors where vid="+req.query.vid,function(err,result){
		console.log(err);
		chuli1(err,result,res);
	});
});
router.get("/edit",function(req,res){
	var visname=req.query.visname;
	var certype=req.query.certype;
	var cernum=req.query.cernum;
	var vistime=req.query.vistime;
	var leatime=req.query.leatime;
	var because=req.query.because;
	var vid=req.query.vid;
	mysql.query("update visitors set visname=?,certype=?,cernum=?,vistime=?,leatime=?,because=? where vid=?",[visname,certype,cernum,vistime,leatime,because,vid],function(err,result){
		chuli(err,result,res);
	});
});
module.exports = router;



















