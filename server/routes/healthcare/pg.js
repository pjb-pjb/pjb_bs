var express = require('express');
var router = express.Router();
var mysql = require("../mysql-thing");
var chuli = require("../chuli.js");
var chuli1 = require("../chuli1.js");
var async = require("async");
var rz = require("../rz.js");
/* 查询试题 */
router.get('/selTest', function(req, res, next) {
	mysql.getConnection(function(con) {
		con.query("select * from pgtest where ptstatus=0", function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});

/* 查询评估信息 */
router.get("/selPgInfo", function(req, res) {
	mysql.getConnection(function(con) {
		con.query("select pg.*,enter.onum from pg,enter where pg.oid='" + req.query.oid + "' and enter.oid='" + req.query.oid + "'", function(err, result) {
			con.release();
			chuli1(err, result, res);
		});
	});
});

/* 单条添加评估 */
router.get("/addSign", function(req, res) {
	mysql.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				con.release();
				res.end("err");
			} else {
				var {
					oid,
					pscore,
					ptime,
					weight,
					gmyw,
					disease
				} = req.query;
				var grade = "";
				if(pscore >= 90) {
					grade = '三级';
				} else if(pscore < 90 && pscore >= 75) {
					grade = "二级";
				} else if(pscore < 75 && pscore >= 60) {
					grade = "一级";
				} else {
					grade = "特殊";
				}
				async.parallel([function(next) {
					con.query("insert into pg (oid,pscore,ptime,weight,gmyw,disease,grade) values (?,?,?,?,?,?,?)", [oid, pscore, ptime, weight, gmyw, disease, grade], function(err, result) {
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
					con.query("update enter set estatus=2 where oid='" + oid + "'", function(err, result) {
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
								rz(req, "老人评估(" + oid + ")");
							}
						});
					}
				});
			}
		});
	});
});

/* 修改 */
router.get("/edit", function(req, res) {
	mysql.getConnection(function(con) {
		con.beginTransaction(function(err) {
			if(err) {
				con.release();
				res.end("err");
			} else {
				var {
					oid,
					pscore,
					ptime,
					weight,
					gmyw,
					disease,
					pid
				} = req.query;
				var grade = "";
				if(pscore >= 90) {
					grade = '三级';
				} else if(pscore < 90 && pscore >= 75) {
					grade = "二级";
				} else if(pscore < 75 && pscore >= 60) {
					grade = "一级";
				} else {
					grade = "特殊";
				}
				async.parallel([function(next) {
					con.query("update pg set pscore=?,ptime=?,weight=?,gmyw=?,disease=?,grade=? where pid=?", [pscore, ptime, weight, gmyw, disease, grade, req.query.pid], function(err, result) {
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
					var sql = "update contract,nurse set contract.grade='" + grade + "',contract.nprice=nurse.nprice where oid='" + oid + "' and nurse.grade='" + grade + "'";
					con.query(sql, function(err, result) {
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
								rz(req, "老人重新评估(" + oid + ")");
							}
						});
					}
				});
			}
		});
	});
});
module.exports = router;