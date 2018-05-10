var express = require('express');
var router = express.Router();
var mysql1 = require("../mysql-thing");
var mysql = require("../mysql");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");

/*查询费用剩余*/
router.get("/selectAll", function(req, res) {
	var like = "";
	var isQf = req.query.isQf;
	var str = "";
	if(isQf == 0) {
		str = "";
	} else {
		str = " and contract.yjf<=0";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or contract.oid like '%" + req.query.like + "%') and contract.oid=enter.oid and enter.estatus=1" + str;
	} else {
		like = " where contract.oid=enter.oid and enter.estatus=1" + str;
	}
	var sql = "select contract.oid,enter.oname,contract.yjf from contract,enter" + like;
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
	if(isQf == 0) {
		str = "";
	} else {
		str = " and contract.yjf<=0";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%' or contract.oid like '%" + req.query.like + "%') and contract.oid=enter.oid and enter.estatus=1" + str;
	} else {
		like = " where contract.oid=enter.oid and enter.estatus=1" + str;
	}
	var sql = "select contract.oid,enter.oname,contract.yjf from contract,enter" + like + " limit " + parseInt(req.query.page * 10) + ",10";
	console.log(sql);
	mysql.query(sql, function(err, result) {
		chuli1(err, result, res);
	});
});

/*查询费用详情*/
router.get("/selCostAll", function(req, res) {
	var like = "";
	var isQf = req.query.isQf;
	var str = "";
	if(isQf == 2) {
		str = "";
	} else if(isQf == 0){
		str = " and cost.coststatus=0";
	}else{
		str = " and cost.coststatus=1";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%') and cost.oid=enter.oid and cost.oid='"+req.query.oid+"'" + str;
	} else {
		like = " where cost.oid=enter.oid and cost.oid='"+req.query.oid+"'"+ str;
	}
	var sql = "select cost.*,enter.oname from cost,enter" + like;
	mysql.query(sql, function(err, result) {
		if(err) {
			res.end("1")
		} else {
			res.end((Math.ceil(result.length / 10)).toString());
		}
	})
});
router.get("/selCostPage", function(req, res) {
	var like = "";
	var isQf = req.query.isQf;
	var str = "";
	if(isQf == 2) {
		str = "";
	} else if(isQf == 0){
		str = " and cost.coststatus=0";
	}else{
		str = " and cost.coststatus=1";
	}
	if(req.query.like) {
		like = " where (enter.oname like '%" + req.query.like + "%') and cost.oid=enter.oid and cost.oid='"+req.query.oid+"'" + str;
	} else {
		like = " where cost.oid=enter.oid and cost.oid='"+req.query.oid+"'"+ str;
	}
	var sql = "select cost.*,enter.oname from cost,enter" + like + " limit " + parseInt(req.query.page * 10) + ",10";
	console.log(sql);
	mysql.query(sql, function(err, result) {
		chuli1(err, result, res);
	});
});

/*缴费*/
router.get("/jf", function(req, res) {
	mysql1.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				res.end("err");
				return;
			}
			async.parallel([function(next) {
				con.query("update contract set yjf=? where oid=?", [req.query.yjf, req.query.oid], function(err, result) {
					if(err) {
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
				con.query("insert into cost (oid,coststatus,costtime,costamount,cost_method) values (?,?,?,?)", [req.query.oid,0, time(new Date()), req.query.jf, "缴费"], function(err, result) {
					if(err) {
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