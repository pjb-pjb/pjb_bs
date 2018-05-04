var express = require('express');
var router = express.Router();
var mysql=require("../mysql-thing.js");
var chuli1=require("../chuli1.js");
var chuli=require("../chuli.js");
var fs=require("fs");
var path=require("path");
var xlsx=require("node-xlsx");
var async=require("async");
var multer=require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now()+"-"+file.originalname)
  }
})
 
var upload = multer({ storage: storage })
/*按条件  分页查询*/
router.get('/selectAll', function(req, res, next) {
	var like="";
	if(req.query.like){
		like=" where (worker.wnum like '%"+req.query.like+"%' or worker.wname like '%"+req.query.like+"%' or branch.bname like '%"+req.query.like+"%') and (worker.bnum=branch.bnum and wstatus=0)";
	}else{
		like=" where (worker.bnum=branch.bnum and wstatus=0)";
	}
	var sql="select worker.*,branch.bname from worker,branch"+like;
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			con.release();			
			if(err){
				res.end("1");				
			}else{
				res.end((Math.ceil(result.length/10)).toString());
			}
		});
	});
});


router.get("/selectPage",function(req,res){
	var like="";
	if(req.query.like){
		like=" where (worker.wnum like '%"+req.query.like+"%' or worker.wname like '%"+req.query.like+"%' or branch.bname like '%"+req.query.like+"%') and (worker.bnum=branch.bnum and wstatus=0)";
	}else{
		like=" where (worker.bnum=branch.bnum and wstatus=0)";
	}
	var sql="select worker.*,branch.bname from worker,branch"+like+" limit "+req.query.page*10+",10";
	mysql.getConnection(function(con){
		con.query(sql,function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

/*查询部门*/
router.get("/selectBra",function(req,res){
	mysql.getConnection(function(con){
		con.query("select bnum,bname from branch",function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});

/*单条添加*/
router.get("/addSign",function(req,res){
	var wname=req.query.wname;
	var wnum=req.query.wnum;
	var bnum=req.query.bnum;
	mysql.getConnection(function(con){
		con.query("insert into worker (wname,wnum,bnum) values (?,?,?)",[wname,wnum,bnum],function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});

/*批量添加*/
router.post("/addMore",upload.single('file'),function(req,res){
	mysql.getConnection(function(con){
		async.parallel([function(next){
			con.query("select branch.bname,branch.bnum from branch",function(err,result){
				var obj={};
				result.forEach(function(val){
					obj[val.bname]=val.bnum;
				});
				next(err,obj);
			});
		}],function(err,results){
			if(err){
				res.end("err");
			}else{
				var arr=xlsx.parse(req.file.path);
				var arr1=[];
				arr.forEach(function(val){
					val.data.forEach(function(val1,index){
						if(index==0){
							return;
						}
						var arr2=[val1[0],val1[1],results[0][val1[2]]];
						arr1.push(arr2);
					});
				});
				con.query("insert into worker (wname,wnum,bnum) values ?",[arr1],function(err,result){
					con.release();
					chuli(err,result,res);
				});
			}
		});
	})
});

/*单条删除*/
router.get("/delSign",function(req,res){
	mysql.getConnection(function(con){
		con.query("update worker set wstatus=1 where wid="+req.query.wid,function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});


/*修改*/
router.get("/selectByWid",function(req,res){
	mysql.getConnection(function(con){
		con.query("select * from worker where wid="+req.query.wid,function(err,result){
			con.release();
			chuli1(err,result,res);
		});
	});
});
router.get("/edit",function(req,res){
	mysql.getConnection(function(con){
		con.query("update worker set wname=?,bnum=? where wid=?",[req.query.wname,req.query.bnum,req.query.wid],function(err,result){
			con.release();
			chuli(err,result,res);
		});
	});
});
module.exports = router;	