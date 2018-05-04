var express = require('express');
var router = express.Router();
var mysql = require("../mysql-thing.js");
var async = require("async");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");

/*单条添加*/
router.get('/addSign', function(req, res, next) {
	var fname = req.query.fname;
	var fprice = req.query.fprice;
	var taboo = req.query.taboo;
	var ftype = req.query.ftype;
	var fnote = req.query.fnote;
	mysql.getConnection(function(con) {
		con.query("insert into food (fname,fprice,taboo,ftype,fnote) values (?,?,?,?,?)", [fname, fprice, taboo, ftype, fnote], function(err, result) {
			con.release();
			chuli(err, result, res);
		});
	});
});

/*按条件 分页查询*/
router.get("/selectAll", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " where fname like '%" + req.query.like + "%' or fprice like '%" + req.query.like + "%' or taboo like '%" + req.query.like + "%'"
	}
	var sql = "select * from food" + like;
	mysql.getConnection(function(con) {
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

router.get("/selectPage", function(req, res) {
	var like = "";
	if(req.query.like) {
		like = " where fname like '%" + req.query.like + "%' or fprice like '%" + req.query.like + "%' or taboo like '%" + req.query.like + "%'"
	}
	var sql = "select * from food" + like + " limit " + req.query.page * 10 + ",10";
	mysql.getConnection(function(con) {
		con.query(sql, function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});

/*单条删除*/
router.get("/delSign", function(req, res) {
	mysql.getConnection(function(con) {
		con.query("delete from food where fid=" + req.query.fid, function(err, result) {
			con.release();
			console.log(result);
			chuli(err, result, res);
		});
	});
});

/*按 fid 查询*/
router.get("/selByFid", function(req, res) {
	mysql.getConnection(function(con) {
		con.query("select * from food where fid=" + req.query.fid, function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});


/*修改*/
router.get("/edit",function(req,res){
	var fname = req.query.fname;
	var fprice = req.query.fprice;
	var taboo = req.query.taboo;
	var ftype = req.query.ftype;
	var fnote = req.query.fnote;
	var fid=req.query.fid;
	mysql.getConnection(function(con){
		con.query("update food set fname=?,fprice=?,taboo=?,ftype=?,fnote=? where fid=?",[fname,fprice,taboo,ftype,fnote,fid],function(err,result){
			chuli(err,result,res);
		});
	});
})
module.exports = router;