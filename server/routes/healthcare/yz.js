var express = require('express');
var router = express.Router();
var mysql = require("../mysql");
var mysql1 = require("../mysql-thing");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var rz = require("../rz.js");
var time = require("../time.js");
var oldInfo={};
/*查询信息*/
router.get("/selInfo",function(req,res){
	async.parallel([function(next){
		mysql.query("select weight,gmyw,disease from pg where oid='"+req.query.oid+"'",function(err,result){
			next(err,result);
		});
	},function(next){
		mysql.query("select * from doctor_advice where oid='"+req.query.oid+"'",function(err,result){
			next(err,result);
		});
	}],function(err,results){
		if(err){
			res.end(JSON.stringify({message:"err"}));
		}else{
			res.end(JSON.stringify(results));
		}
	});
});

/*查询医护人员*/
router.get("/selW",function(req,res){
	mysql.query("select wname from worker where bnum=4",function(err,result){
		chuli1(err,result,res)
	});
});

/*添加*/
router.post("/add",function(req,res){
	var {dcontent,d_endtime,d_type,wname,oid}=req.body;
	if(d_endtime!=""){
		d_endtime=time(new Date(d_endtime));
	}
	var arr=[dcontent,d_endtime,d_type,wname,time(new Date()),oid];
	mysql.query("insert into doctor_advice (dcontent,d_endtime,d_type,wname,dtime,oid) values (?,?,?,?,?,?)",arr,function(err,result){
		if(err){
			res.end("err");
		}else{
			if(result.affectedRows==1){
				res.end("ok");
				rz(req,"新增医嘱("+result.insertId+")");
			}else{
				res.end("err");
			}
		}
	});
});

/*停用*/
router.get("/ty",function(req,res){
	var d_endtime=time(new Date);
	mysql.query("update doctor_advice set d_endtime=? where did=?",[d_endtime,req.query.did],function(err,result){
		if(err){
			res.end(JSON.stringify({message:"err"}));
		}else{
			if(result.affectedRows==1){
				var obj={
					d_endtime:d_endtime,
					message:"ok"
				}
				res.end(JSON.stringify(obj));
				rz(req,"停用医嘱("+req.query.did+")");
			}else{
				res.end(JSON.stringify({message:"err"}));
			}
		}
	});
});

/*修改*/
router.post("/editYz",function(req,res){
	var {dcontent,d_endtime,did}=req.body;
	async.parallel([function(next){
		mysql.query("update doctor_advice set dcontent=?,d_endtime=? where did=?",[dcontent,d_endtime,did],function(err,result){
			next(err,result);
		});
	},function(next){
		var oldStr=oldInfo.dcontent+"&&"+oldInfo.d_endtime;
		var newStr=dcontent+"&&"+d_endtime;
		if(oldStr==newStr){
			next(null);
			return;
		}
		mysql.query("insert into doctor_advice_edit (did,old,new,de_time) values (?,?,?,?)",[did,oldStr,newStr,time(new Date())],function(err,result){
			next(err,result);
		});
	}],function(err,results){
		if(err){
			res.end("err");
		}else{
			res.end("ok");
		}
	});
});

/*按id查询*/
router.get("/selByDid",function(req,res){
	mysql.query("select * from doctor_advice where did="+req.query.did,function(err,result){
		oldInfo=result[0];
		chuli1(err,result,res);
	});
});
module.exports = router;