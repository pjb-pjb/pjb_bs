var express = require('express');
var router = express.Router();
var mysql = require("../mysql-thing");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var time = require("../time.js");
var getId = require("../getId.js");

/* 单条添加 */
router.post('/addSign', function(req, res, next) {
	mysql.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				con.release();
				res.end("err");
			} else {
				var {
					etime,
					oname,
					onum,
					osex,
					otelnum,
					obir,
					oaddress,
					marstatus,
					jnum,
					jname,
					jtelnum,
					jaddress,
					bind,
					jsex
				} = req.body;
				var oid = getId();
				async.parallel([function(next) {
					con.query("insert into enter (etime,oname,onum,osex,otelnum,obir,oaddress,marstatus,oid) values (?,?,?,?,?,?,?,?,?)", [time(new Date(etime)), oname, onum, osex, otelnum, time(new Date(obir)).split(" ")[0], oaddress, marstatus, oid], function(err, result) {
						console.log(err);
						if(err || result.affectedRows <= 0) {
							next("err");
						} else {
							next(null)
						}
					});
				}, function(next) {
					con.query("insert into jiaren (jnum,jname,jtelnum,jaddress,bind,jsex,oid) values (?,?,?,?,?,?,?)", [jnum, jname, jtelnum, jaddress, bind, jsex, oid], function(err, result) {
						if(err || result.affectedRows <= 0) {
							next("err");
						} else {
							next(null);
						}
					});
				}], function(err, results) {
					if(err) {
						con.rollback(() => {
							con.release();
							res.end("err");
						});
					} else {
						con.commit((err) => {
							con.release();
							if(err) {
								res.end("err");
							} else {
								res.end("ok");
							}
						});
					}
				});
			}
		});
	})
});

/* 查询老人数量 */
router.get("/selectAll", function(req, res) {
	mysql.getConnection(function(con) {
		con.query("select oid,oname from enter", function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});

/* 单条查询*/
router.get("/selectSign", function(req, res) {
	async.parallel([function(next){
		mysql.getConnection(function(con) {
			con.query("select enter.*,jiaren.* from enter,jiaren where enter.oid='"+req.query.oid+"' and jiaren.oid='"+req.query.oid+"'", function(err, result) {
				con.release();
					next(err,result[0]);
			});
		});
	},function(next){
		mysql.getConnection(function(con) {
			con.query("select * from pg where oid="+req.query.oid,function(err,result){
				con.release();
				next(err,result[0]);
			});
		});
	}],function(err,results){
		if(err){
			res.end(JSON.stringify({message:"err"}));
		}else{
			res.end(JSON.stringify(results));
		}
	});
})

//router.get("/delSign",function(req,res){
//	mysql.getConnection(function(con) {
//		con.query("delete", function(err, result) {
//			con.release();
//			chuli1(err, result, res);
//		});
//	});
//});

/* 编辑 */
router.post("/edit",function(req,res){
	mysql.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				con.release();
				res.end("err");
			} else {
				console.log(req.body);
				var {
					etime,
					oname,
					onum,
					osex,
					otelnum,
					obir,
					oaddress,
					marstatus,
					jnum,
					jname,
					jtelnum,
					jaddress,
					bind,
					jsex,
					jid,
					eid
				} = req.body;
				async.parallel([function(next) {
					con.query("update enter set oname=?,onum=?,osex=?,otelnum=?,obir=?,oaddress=?,marstatus=? where eid=?", [ oname, onum, osex, otelnum, time(new Date(obir)), oaddress, marstatus, eid], function(err, result) {
						console.log(err);
						if(err || result.affectedRows <= 0) {
							next("err");
						} else {
							next(null)
						}
					});
				}, function(next) {
					con.query("update jiaren set jnum=?,jname=?,jtelnum=?,jaddress=?,bind=?,jsex=? where jid=?", [jnum, jname, jtelnum, jaddress, bind, jsex, jid], function(err, result) {
						console.log(err);
						if(err || result.affectedRows <= 0) {
							next("err");
						} else {
							next(null);
						}
					});
				}], function(err, results) {
					if(err) {
						con.rollback(() => {
							con.release();
							res.end("err");
						});
					} else {
						con.commit((err) => {
							con.release();
							if(err) {
								res.end("err");
							} else {
								res.end("ok");
							}
						});
					}
				});
			}
		});
	})
});

module.exports = router;