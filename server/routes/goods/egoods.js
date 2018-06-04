var express = require('express');
var router = express.Router();
var mysql=require("../mysql-thing.js");
var async=require("async");
var chuli1=require("../chuli1.js");

router.get("/selectAll",function(req,res){
	var like = "";
	if(req.query.like) {
		like = " where (egoods.gnum=goods.gnum) and (goods.gnum like '%"+req.query.like+"%' or goods.gname like '%"+req.query.like+"%' or egoods.etime like '%"+req.query.like+"%')";
	}else{
		like = " where (egoods.gnum=goods.gnum)";
	}
	var sql="select goods.gname,egoods.* from goods,egoods"+like;
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			if(err){
				res.end("1");
			}else{
				res.end((Math.ceil(result.length / 10)).toString());
			}
			con.release();
		})
	});
})
router.get("/selectPage",function(req,res){
	var like = "";
	if(req.query.like) {
		like = " where (egoods.gnum=goods.gnum) and (goods.gnum like '%"+req.query.like+"%' or goods.gname like '%"+req.query.like+"%' or egoods.etime like '%"+req.query.like+"%')";
	}else{
		like = " where (egoods.gnum=goods.gnum)";
	}
	var sql="select goods.gname,egoods.* from goods,egoods"+like+" limit "+req.query.page*10+",10";
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			chuli1(err,result,res);
			con.release();
		});
	});
});
module.exports = router;
