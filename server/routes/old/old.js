var express = require('express');
var router = express.Router();
var mysql = require("../mysql-thing");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");

/*按oid查询*/
router.get('/selInfo', function(req, res, next) {
	mysql.getConnection(function(con){
		con.query("select pg.grade,nurse.nprice from pg,nurse where pg.oid='"+req.query.oid+"' and pg.grade=nurse.grade",function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

/*查询入驻年限,膳食标准*/
router.get("/selEm",function(req,res){
	mysql.getConnection(function(con){
		async.parallel([function(next){
			con.query("select * from enter_method where em_status=0",function(err,result){
				next(err,result);
			});
		},function(next){
			con.query("select * from shanshi where shstatus=0",function(err,result){
				next(err,result);
			});
		}],function(err,results){
			con.release();
			if(err){
				res.end(JSON.stringify({message:"err"}));
			}else{
				res.end(JSON.stringify(results));
			}
		});
	});
});

/*添加*/
router.post("/addSign",function(req,res){
	mysql.getConnection(function(con){
		con.beginTransaction(function(err){
			if(err){
				con.release();
				res.end("err")
			}else{
				var {oid,grade,nprice,eaddress,r_price,ctime,em_n,yjf,shprice,bedinfo,hnum}=req.body;
				var yjf1=yjf;
				var t=time(new Date());
				var avg1=Math.ceil(r_price/30);
				var avg2=Math.ceil(shprice/30);
				var avg3=Math.ceil(nprice/30);
				var n=new Date().getDate();
				yjf=yjf-(r_price*1+shprice*1+nprice*1)+(avg1+avg2+avg3)*(n-1);
				async.parallel([
					function(next){
						var arr=[];
						arr.push([oid,0,t,yjf1,"缴费"]);
						arr.push([oid,1,t,r_price-avg1*(n-1),"床位费"]);
						arr.push([oid,1,t,shprice-avg2*(n-1),"膳食费"]);
						arr.push([oid,1,t,nprice-avg3*(n-1),"护理费"]);
						con.query("insert into cost (oid,coststatus,costtime,costamount,cost_method) values ?",[arr],function(err,result){
							if(err){
								console.log(err);
								next("err");
							}else{
								if(result.affectedRows==4){
									next(null);
								}else{
									next("err");
								}
							}
						});
					},
					function(next){
						con.query("update enter set estatus=1 where oid='"+oid+"'",function(err,result){
							if(err){
								next("err");
								console.log(err);
							}else{
								if(result.affectedRows==1){
									next(null);
								}else{
									next("err");
								}
							}
						});
					},
					function(next){
						con.query("update hours set bedinfo='"+bedinfo+"' where hnum='"+hnum+"'",function(err,result){
							if(err){
								next("err");
								console.log(err);
							}else{
								if(result.affectedRows==1){
									next(null);
								}else{
									next("err");
								}
							}
						});
					},
					function(next){
						ctime=time(new Date(ctime)).split(" ")[0];
						if(em_n!="-1"){
							var str=ctime.substring(0,4);
							var str1=str*1+em_n*1;
							var endtime=ctime;
							endtime=endtime.replace(str,str1);
						}else{
							var endtime="";
						}
						con.query("insert into contract (oid,grade,nprice,eaddress,r_price,ctime,endtime,em_n,yjf,shprice) values (?,?,?,?,?,?,?,?,?,?)",[oid,grade,nprice,eaddress,r_price,ctime,endtime,em_n,yjf,shprice],function(err,result){
							if(err){
								next("err");
								console.log(err);
							}else{
								if(result.affectedRows==1){
									next(null);
								}else{
									next("err");
								}
							}
						});
					}
				],function(err,results){
					if(err){
						con.rollback(function(){
							con.release();
							res.end("err");
						});
					}else{
						con.commit(function(err){
							con.release();
							if(err){
								res.end("err");
							}else{
								res.end("ok");
							}
						});
					}
				});
			}
		});
	});
});

/*查询签约年限*/
router.get("/selEM1",function(req,res){
	mysql.getConnection(function(con){
		con.query("select * from enter_method where em_status=0",function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

/*续约*/
router.get("/xy",function(req,res){
	var {xynx,endtime,em_n,oid}=req.query;
	mysql.getConnection(function(con){
		if(xynx==-1){
			em_n=-1;
			endtime="";
		}else{
			endtime=time(new Date(endtime));
			em_n=em_n*1+xynx*1;	
			var str=endtime.substring(0,4);
			var str1=str*1+xynx*1;
			endtime=endtime.replace(str,str1);
		}
		con.query("update contract set em_n=?,endtime=? where oid=?",[em_n,endtime,oid],function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});
module.exports = router;
