var express = require('express');
var router = express.Router();
var mysql=require("../mysql-thing.js");
var async=require("async");
var chuli1=require("../chuli1.js");
/*查询信息*/
router.get('/selectInfo', function(req, res, next) {
	mysql.getConnection(function(con){
		async.parallel([function(next){
			con.query("select gname,gnum,gamount from goods",function(err,result){
				next(err,result);
			});
		},function(next){
			con.query("select bnum,bname from branch",function(err,result){
				next(err,result);
			});
		},function(next){
			con.query("select wnum,wname from worker where wstatus=0",function(err,result){
				next(err,result);
			});
		}],function(err,results){
			con.release();
			if(err){
				res.end(JSON.stringify({message:"err"}));
			}else{
				var obj={};
				obj.braDatas=results[1];
				obj.workerDatas=results[2];
				obj.goodsDatas=results[0];
				res.end(JSON.stringify(obj));
			}
		});
	});
});

/*单条添加*/
router.get("/addSign",function(req,res){
	var wnum=req.query.wnum;
	var bnum=req.query.bnum;
	var oamount=req.query.oamount;
	var gnum=req.query.gnum;
	var otime=req.query.otime;
	var obecause=req.query.obecause;
	mysql.getConnection(function(con){
		con.beginTransaction(function(err){
			if(err){
				res.end("err");
				return;
			}
			var wnum=req.query.wnum;
			var bnum=req.query.bnum;
			var oamount=req.query.oamount;
			var gnum=req.query.gnum;
			var otime=req.query.otime;
			var obecause=req.query.obecause;
			var gamount=req.query.gamount;
			async.parallel([function(next){
				var sql="insert into outgoods (wnum,bnum,oamount,gnum,otime,obecause) values (?,?,?,?,?,?)";
				con.query(sql,[wnum,bnum,oamount,gnum,otime,obecause],function(err,result){
					next(err,result);
				});
			},function(next){
				con.query("update goods set gamount="+gamount+" where gnum="+gnum,function(err,result){
					next(err,result);
				});
			}],function(err,results){
				console.log(err);
				if(err||!(results[0].affectedRows>0&&results[1].affectedRows>0)){
					con.rollback(function(){
						con.release();
						res.end("err");
					});
				}else{
					con.commit(function(err){
						if(err){
							res.end("err")
						}else{
							res.end("ok");
						}						
						con.release();
					});
				}
			});
		});
	});
});



router.get("/selectAll",function(req,res){
	var like = "";
	if(req.query.like) {
		like = " where (goods.gname like '%" + req.query.like + "%' or branch.bname like '%" + req.query.like + "%' or worker.wname like '%"+req.query.like+"%') and (outgoods.gnum=goods.gnum and outgoods.wnum=worker.wnum and outgoods.bnum=branch.bnum)";
	}else{
		like = " where (outgoods.gnum=goods.gnum and outgoods.wnum=worker.wnum and outgoods.bnum=branch.bnum)";
	}
	var sql = "select outgoods.*,goods.gname,worker.wname,branch.bname from outgoods,goods,worker,branch" + like;
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			console.log(err);
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
		like = " where (goods.gname like '%" + req.query.like + "%' or branch.bname like '%" + req.query.like + "%' or worker.wname like '%"+req.query.like+"%') and (outgoods.gnum=goods.gnum and outgoods.wnum=worker.wnum and outgoods.bnum=branch.bnum)";
	}else{
		like = " where (outgoods.gnum=goods.gnum and outgoods.wnum=worker.wnum and outgoods.bnum=branch.bnum)";
	}
	var sql = "select outgoods.*,goods.gname,worker.wname,branch.bname from outgoods,goods,worker,branch" + like+" limit "+req.query.page*10+",10";
	console.log(sql);
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			chuli1(err,result,res);
			con.release();
		});
	});
});
module.exports = router;
