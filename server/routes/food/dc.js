var express = require('express');
var router = express.Router();
var mysql1 = require("../mysql-thing");
var mysql = require("../mysql");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");

/*按条件分页查询*/
router.get("/selectAll", function(req, res) {
	var like="";
	if(req.query.like){
		like=` and (enter.oname like '%${req.query.like}%' or food.fname like '%${req.query.like}%' or contract.eaddress like '%${req.query.like}%')`;
	}
	if(!(req.query.cftime==""||req.query.cftime=="null")){
		like=like+" and `order`.cftime='"+time(new Date(req.query.cftime)).split(" ")[0]+"'";
	}
	if(req.query.cftime1){
		like=like+" and `order`.cftime1='"+req.query.cftime1+"'";
	}
	like=" where `order`.orderstatus=0 and `order`.oid=enter.oid and `order`.oid=contract.oid and `order`.fid=food.fid"+like;
	var sql="select `order`.order_id from `order`,enter,contract,food"+like;
	mysql.query(sql,function(err,result){
		if(err) {
			res.end("1")
		} else {
			res.end((Math.ceil(result.length / 10)).toString());
		}
	});
});
router.get("/selectPage", function(req, res) {
	var like="";
	if(req.query.like){
		like=` and (enter.oname like '%${req.query.like}%' or food.fname like '%${req.query.like}%' or contract.eaddress like '%${req.query.like}%')`;
	}
	if(!(req.query.cftime==""||req.query.cftime=="null")){
		like=like+" and `order`.cftime='"+time(new Date(req.query.cftime)).split(" ")[0]+"'";
	}
	if(req.query.cftime1){
		like=like+" and `order`.cftime1='"+req.query.cftime1+"'";
	}
	like=" where `order`.orderstatus=0 and `order`.oid=enter.oid and `order`.oid=contract.oid and `order`.fid=food.fid"+like;
	var sql="select `order`.*,enter.oname,contract.eaddress,food.fname from `order`,enter,contract,food"+like+" limit " + parseInt(req.query.page * 10) + ",10";
	mysql.query(sql,function(err,result){
		chuli1(err, result, res);
	});
});

router.get("/selectAll1", function(req, res) {
	var like="";
	if(req.query.like){
		like=` and (enter.oname like '%${req.query.like}%' or food.fname like '%${req.query.like}%' or contract.eaddress like '%${req.query.like}%')`;
	}
	if(!(req.query.cftime==""||req.query.cftime=="null")){
		like=like+" and `order`.cftime='"+time(new Date(req.query.cftime)).split(" ")[0]+"'";
	}
	if(req.query.cftime1){
		like=like+" and `order`.cftime1='"+req.query.cftime1+"'";
	}
	like=" where `order`.orderstatus=1 and `order`.oid=enter.oid and `order`.oid=contract.oid and `order`.fid=food.fid"+like;
	var sql="select `order`.order_id from `order`,enter,contract,food"+like;
	mysql.query(sql,function(err,result){
		if(err) {
			res.end("1")
		} else {
			res.end((Math.ceil(result.length / 10)).toString());
		}
	});
});
router.get("/selectPage1", function(req, res) {
	var like="";
	if(req.query.like){
		like=` and (enter.oname like '%${req.query.like}%' or food.fname like '%${req.query.like}%' or contract.eaddress like '%${req.query.like}%')`;
	}
	if(!(req.query.cftime==""||req.query.cftime=="null")){
		like=like+" and `order`.cftime='"+time(new Date(req.query.cftime)).split(" ")[0]+"'";
	}
	if(req.query.cftime1){
		like=like+" and `order`.cftime1='"+req.query.cftime1+"'";
	}
	like=" where `order`.orderstatus=1 and `order`.oid=enter.oid and `order`.oid=contract.oid and `order`.fid=food.fid"+like;
	var sql="select `order`.*,enter.oname,contract.eaddress,food.fname from `order`,enter,contract,food"+like+" limit " + parseInt(req.query.page * 10) + ",10";
	mysql.query(sql,function(err,result){
		chuli1(err, result, res);
	});
});

router.get("/selFood",function(req,res){
	mysql.query("select * from food",function(err,result){
		chuli1(err,result,res);
	});
});

router.get("/selOldInfo",function(req,res){
	mysql.query("select pg.disease,contract.eaddress from pg,contract where contract.oid=? and pg.oid=?",[req.query.oid,req.query.oid],function(err,result){
		console.log(err);
		chuli1(err,result,res)
	});
});

/*单条点餐*/
router.get("/addSign",function(req,res){
	var {oid,fids,cftime,cftime1}=req.query;
	var arr=[];
	fids=JSON.parse(fids);
	fids.forEach(function(val){
		var arr1=[]
		arr1.push(oid);
		arr1.push(val);
		arr1.push(time(new Date()));
		arr1.push(time(new Date(cftime)).split(" ")[0]);
		arr1.push(cftime1);
		arr.push(arr1);
	});
	mysql.query("insert into `order` (oid,fid,dctime,cftime,cftime1) values ?",[arr],function(err,result){
		console.log(err);
		chuli(err,result,res);
	});
});

router.get("/qr",function(req,res){
	mysql.query("update `order` set orderstatus=1,sctime='"+time(new Date())+"' where order_id="+req.query.order_id,function(err,result){
		chuli(err,result,res);
	});
});

router.get("/qx",function(req,res){
	mysql.query("update `order` set orderstatus=-1,sctime='"+time(new Date())+"' where order_id="+req.query.order_id,function(err,result){
		chuli(err,result,res);
	});
});
module.exports = router;