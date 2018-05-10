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
	var like = "";
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or contract.oid like '%" + req.query.like + "%') and contract.oid=enter.oid and enter.estatus=1";
	} else {
		like = " where contract.oid=enter.oid and enter.estatus=1";
	}
	var sql = "select contract.oid,contract.endtime,contract.ctime,contract.yjf,enter.oname from contract,enter" + like;
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
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or contract.oid like '%" + req.query.like + "%') and contract.oid=enter.oid and enter.estatus=1";
	} else {
		like = " where contract.oid=enter.oid and enter.estatus=1";
	}
	var sql = "select contract.oid,contract.endtime,contract.ctime,contract.yjf,enter.oname from contract,enter" + like + " limit " + parseInt(req.query.page * 10) + ",10";
	mysql.query(sql, function(err, result) {
		chuli1(err, result, res);
	});
});

/*按oid查询*/
router.get("/selByOid", function(req, res) {
	mysql.query("select contract.*,enter.oname from contract,enter where contract.oid='" + req.query.oid + "' and contract.oid=enter.oid ", function(err, result) {
		if(err) {
			res.end(JSON.stringify({
				message: "err"
			}));
		} else {
			res.end(JSON.stringify(result));
		}
	});
});


/*查询房间信息*/
router.get("/selRoom",function(req,res){
	mysql.query("select bedinfo from hours where hnum='"+req.query.hnum+"'",function(err,result){
		if(err){
			res.end("err");
		}else{
			res.end(result[0].bedinfo);
		}
	});
});

/*退住*/
router.get("/tz", function(req, res) {
	var {
		oid,
		price,
		price1,
		bedinfo,
		hnum
	} = req.query;
	mysql1.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				con.release();
				res.end("err");
				return;
			}
			async.parallel([function(next){
				con.query("update hours set bedinfo=? where hnum=?",[bedinfo,hnum],function(err,result){
					if(err) {
						console.log(err);
						next("err");
					} else {
						if(result.affectedRows == 1) {
							next(null);
						} else {
							next("err");
						}
					}
				});
			},function(next) {
				var arr = [];
				if(price1 > 0) {
					arr.push([oid, 1, time(new Date()), price1, "退住扣费"]);
				}
				if(price > 0) {
					arr.push([oid, 2, time(new Date()), price, "退住退费"])
				}
				if(price < 0) {
					arr.push([oid, 0, time(new Date()), price, "退住缴费"]);
				}
				con.query("insert into cost (oid,coststatus,costtime,costamount,cost_method) values ?", [arr], function(err, result) {
					if(err) {
						console.log(err);
						next("err");
					} else {
						console.log(result.affectedRows);
						if(result.affectedRows >= 1) {
							next(null);
						} else {
							next("err");
						}
					}
				});
			}, function(next) {
				con.query("update contract set cstatus=-1,yjf=0 where oid='" + oid + "'", function(err, result) {
					if(err) {
						console.log(err);
						next("err");
					} else {
						if(result.affectedRows == 1) {
							next(null);
						} else {
							next("err");
						}
					}
				});
			}, function(next) {
				con.query("update enter set estatus=-1 where oid='" + oid + "'", function(err, result) {
					if(err) {
						console.log(err);
						next("err");
					} else {
						if(result.affectedRows == 1) {
							next(null);
						} else {
							next("err");
						}
					}
				});
			}], function(err, results) {
				if(err) {
					con.rollback(function() {
						con.release();
						res.end("err");
					});
				} else {
					con.commit(function(err) {
						con.release();
						if(err) {
							res.end("err");
						} else {
							res.end("ok");
						}
					});
				}
			});
		});
	});
});

module.exports = router;