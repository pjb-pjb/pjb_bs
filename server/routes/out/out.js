var express = require('express');
var router = express.Router();
var mysql1 = require("../mysql-thing");
var mysql = require("../mysql");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");
var rz = require("../rz.js");

/*查询陪护人员信息*/
router.get("/selNurse",function(req,res){
	mysql.query("select wnum,wname from worker where bnum=4 and wstatus=0",function(err,result){
		chuli1(err,result,res);
	});
});

/*单条添加信息*/
router.get("/addSign",function(req,res){
	var {oid,otime,nursename,outbecause}=req.query;
	mysql.query("insert into `out` (oid,otime,nursename,outbecause) values (?,?,?,?)",[oid,otime,nursename?nursename:"",outbecause],function(err,result){
		chuli(err,result,res);
		rz(req,"老人外出登记("+oid+")");
	});
});

/*按条件分页查询*/
router.get("/selectAll", function(req, res) {
	var like = "";
	var isQf = req.query.isQf;
	var str = "";
	if(isQf == 2) {
		str = "";
	} else if(isQf == 0){
		str = " and `out`.ostatus=0";
	}else{
		str = " and `out`.ostatus=1";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or `out`.oid like '%" + req.query.like + "%') and `out`.oid=enter.oid and enter.estatus=1" + str;
	} else {
		like = " where `out`.oid=enter.oid and enter.estatus=1"+ str;
	}
	var sql = "select `out`.*,enter.oname from `out`,enter" + like;
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
	var isQf = req.query.isQf;
	var str = "";
	if(isQf == 2) {
		str = "";
	} else if(isQf == 0){
		str = " and `out`.ostatus=0";
	}else{
		str = " and `out`.ostatus=1";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or `out`.oid like '%" + req.query.like + "%') and `out`.oid=enter.oid and enter.estatus=1" + str;
	} else {
		like = " where `out`.oid=enter.oid and enter.estatus=1"+ str;
	}
	var sql = "select `out`.*,enter.oname from `out`,enter" + like + " limit " + parseInt(req.query.page * 10) + ",10";
	mysql.query(sql, function(err, result) {
		chuli1(err, result, res);
	});
});

/*确认返回*/
router.get("/qrfh",function(req,res){
	mysql.query("update `out` set ostatus=1,backtime='"+req.query.backtime+"' where oid='"+req.query.oid+"'",function(err,result){
		chuli(err,result,res);
		rz(req,"老人返回("+req.query.oid+")");
	});
});
module.exports = router;