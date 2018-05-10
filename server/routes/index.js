//var async = require("async");
//var mysql = require("./mysql-thing.js");
//var time = require("./time");
//setInterval(function() {
//	var time1 = new Date();
//	var day = time1.getDate();
//
//	function kf() {
//		if(day == 1) {
//			mysql.getConnection(function(con) {
//				con.beginTransaction(function(err) {
//					if(err) {
//						con.release();
//						setTimeout(function() {
//							kf();
//						}, 10000);
//					} else {
//						async.auto({
//							sel: function(next) {
//								var time2 = time(time1).split(" ")[0];
//								con.query("select oid,nprice,r_price,yjf,shprice,endtime from contract where endtime='' or endtime>" + time2, function(err, result) {
//									result.forEach(function(val, index) {
//										if(val.endtime == "" || time2.substring(0, 7) != val.endtime.substring(0, 7)) {
//											val.yjf = val.yjf - val.nprice - val.r_price - val.shprice;
//										} else {
//											var avg1 = Math.ceil(val.r_price / 30);
//											var avg2 = Math.ceil(val.shprice / 30);
//											var avg3 = Math.ceil(val.nprice / 30);
//											var n = parseInt(val.endtime.split("-")[2]);
//											val.yjf = val.yjf - (avg1 + avg2 + avg3) * n;
//											val.r_price = avg1 * n;
//											val.shprice = avg2 * n;
//											val.nprice = avg3 * n;
//										}
//									});
//									next(err, result);
//								});
//							},
//							add1: ["sel", function(results, next) {
//								var arr = [];
//								results.sel.forEach(function(val) {
//									arr.push([val.oid, 1, time1, val.r_price, "床位费"]);
//									arr.push([val.oid, 1, time1, val.shprice, "膳食费"]);
//									arr.push([val.oid, 1, time1, val.nprice, "护理费"]);
//								});
//								con.query("insert into cost (oid,coststatus,costtime,costamount,cost_method) values ?", [arr], function(err, result) {
//									if(err) {
//										next("err");
//									} else {
//										next(null);
//									}
//								});
//							}],
//							add2: ["sel", function(results, next) {
//								var str = "";
//								var str1 = "";
//								results.sel.forEach(function(val) {
//									str += `when '${val.oid}' then ${val.yjf} `;
//									str1 += `'${val.oid}',`;
//								});
//								var sql = `update contract set yjf=case oid ${str}end where oid in (${str1.slice(0,-1)})`;
//								con.query(sql, function(err, result) {
//									if(err) {
//										next("err");
//									} else {
//										next(null);
//									}
//								});
//							}]
//						}, function(err, results) {
//							if(err) {
//								con.rollback(function() {
//									con.release();
//									setTimeout(function() {
//										kf();
//									}, 10000);
//								});
//							} else {
//								con.commit(function(err) {
//									con.release();
//									if(err) {
//										setTimeout(function() {
//											kf();
//										}, 10000);
//									}else{
//									}
//								});
//							}
//						});
//					}
//				});
//			});
//		}
//	}
//	kf();
//}, 60 * 60 * 24 * 1000);