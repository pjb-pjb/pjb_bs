<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="oname">
				<el-select v-model="form.oname" placeholder="请选择" filterable @change="change">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in onameDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="编号" prop="oid">
				<el-select v-model="form.oid" placeholder="请选择" filterable @change="change1">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in oidDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="签约时间">
				<el-date-picker type="date" placeholder="请选择" v-model="form.ctime" style="width: 220px;" disabled></el-date-picker>
			</el-form-item>
			<el-form-item label="签约年限" prop="em_n">
				<el-select v-model="form['em_n']" placeholder="请选择" filterable @change="change1">
					<el-option :key="index" :label="item['em_name']" :value="item['em_n'].toString()" v-for="(item,index) in emDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="位置" prop="eaddress">
				<el-input v-model="form.eaddress" readonly style="width: 217px;" @focus="selAddress"></el-input>
			</el-form-item>
			<el-form-item label="床位费">
				<el-input v-model="form.r_price" disabled style="width: 217px;"></el-input>
			</el-form-item>
			<el-form-item label="预交费" prop="yjf">
				<el-input v-model="form.yjf" type="number" style="width: 217px;"></el-input>
			</el-form-item>
			<el-form-item label="膳食标准" prop="shprice">
				<el-select v-model="form['shprice']" placeholder="请选择" filterable>
					<el-option :key="index" :label="item['shprice']+'/月'" :value="item['shprice'].toString()" v-for="(item,index) in sDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="护理等级" prop="grade">
				<el-input v-model="form.grade" disabled style="width: 217px;"></el-input>
			</el-form-item>
			<el-form-item label="护理费" prop="grade_price">
				<el-input v-model="form.nprice" disabled style="width: 217px;"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="tijiao">提交</el-button>
			</el-form-item>
		</el-form>
		<div v-if="flag" style="width: 100%;min-height: 100%;background: rgba(255,255,255,1);position: absolute;left: 0;top: 0;">
			<div style="width: 90%;margin: 0 auto;">
				<el-select v-model="hnum" placeholder="请选择" style="width: 100%;">
					<el-option :key="index" :label="val" :value="val" v-for="(item,val,index) of bedDatas"></el-option>
				</el-select>
				<el-row>
					<div v-for="(item,index) in bedDatas[hnum]" style="box-sizing: border-box;border: 1px solid #000;justify-content: flex-start;overflow: hidden;display: flex;">
						<div style="display: flex;justify-content:center;align-items: center;border-right: 1px solid #000;font-size: 26px;width: 50px;text-align: center;">
							{{item[0]}}<br/>层
						</div>
						<div style="flex-grow: 1;padding: 10px;">
							<el-col :span="8" v-for="(item1,index1) in item[1]" :key="index1">
								<el-card shadow="hover" :body-style="{ padding: '0px' }" style="min-height: 150px;">
									<div @dblclick="qz(item1,item[3],index,index1)">
										<div style="font-size: 24px;padding: 5px 0;text-align: center;">
											<span>{{item1[0]}}({{item[2]}})</span>
										</div>
										<div style="display: flex;">
											<img src="../../assets/kc.png" class="image">
											<div style="flex-grow: 1;text-align: center;">
												<div v-if="item1[1]==-1">
													<span class="yuan"></span>
													<div>已满</div>
												</div>
												<div v-else>
													<span class="yuan1"></span>
													<div>空余{{item1[1]}}张床</div>
												</div>
											</div>
										</div>
									</div>
								</el-card>
							</el-col>
						</div>
					</div>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			fetch("/api/enter/selectAll1").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
			fetch("/api/old/selEm").then(function(e) {
				return e.json();
			}).then((e) => {
				this.emDatas = e[0];
				this.sDatas = e[1];
			});
		},
		methods: {
			qz(item, r_price, index, index1) {
				if(item[1] == -1) {
					this.$message({
						message: "该房间已满",
						type: "warning"
					});
					return;
				}
				this.arr=[this.hnum, index, index1]
				this.form.eaddress = this.hnum + item[0];
				this.form.r_price = r_price;
				this.flag = false;
			},
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
					}
				});
				this.sel();
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
					}
				});
				this.sel();
			},
			tijiao() {
				this.$refs["form"].validate((valid) => {
					if(valid) {
						var oid = this.form.oid;
						var grade = this.form.grade;
						var nprice = this.form.nprice;
						var eaddress = this.form.eaddress;
						var r_price = this.form.r_price;
						var ctime = this.form.ctime;
						var em_n = this.form.em_n;
						var yjf = this.form.yjf;
						var shprice = this.form.shprice;
						var arr=this.arr;
						this.bedDatas[arr[0]][arr[1]][1][arr[2]][1]=this.bedDatas[arr[0]][arr[1]][1][arr[2]][1]-1;
						this.bedDatas[arr[0]][arr[1]][1][arr[2]][2]=this.bedDatas[arr[0]][arr[1]][1][arr[2]][2]*1+1;
						var bedinfo="";
						this.bedDatas[arr[0]].forEach((item)=>{
							var louceng=item[0];
							var str="";
							item[1].forEach((val)=>{
								str+=val[0]+":"+val[2]+","
							});
							str=louceng+"."+str.slice(0,-1);
							bedinfo+=str+"|"
						});
						bedinfo=bedinfo.slice(0,-1);
						var params = `oid=${oid}&grade=${grade}&nprice=${nprice}&eaddress=${eaddress}&r_price=${r_price}&ctime=${ctime}&em_n=${em_n}&yjf=${yjf}&shprice=${shprice}&bedinfo=${bedinfo}&hnum=${this.arr[0]}`;
						fetch("/api/old/addSign", {
							headers: {
								"content-type": "application/x-www-form-urlencoded"
							},
							method: "post",
							body: params,
							credentials: 'include'
						}).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.$message({
									message: "添加成功",
									type: "success"
								});
								for(let i in this.form) {
									this.form[i] = "";
								}
								fetch("/api/enter/selectAll1").then(function(e) {
									return e.json();
								}).then((e) => {
									this.oidDatas=[];
									this.onameDatas=[];
									e.forEach((val) => {
										this.oidDatas.push(val.oid);
										this.onameDatas.push(val.oname);
									});
								});
							} else {
								this.$message({
									message: "添加失败",
									type: "error"
								});
							}
						});
					} else {
						return false;
					}
				});
			},
			sel() {
				fetch("/api/old/selInfo?oid=" + this.form.oid).then(function(e) {
					return e.json();
				}).then((e) => {
					for(let i in e[0]) {
						this.form[i] = e[0][i];
					}
				});
			},
			selAddress() {
				fetch("api/bed/select").then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						var obj = {};
						this.hnum = e.length > 0 ? e[0].hnum : "";
						e.forEach((val) => {
							obj[val.hnum] = [];
							val.bedinfo.split("|").forEach((val1) => {
								var arr = [];
								var arr1 = [];
								arr1 = val1.split(".");
								arr1[1].split(",").forEach((val2) => {
									var arr2 = val2.split(":");
									if(arr2[1] == val.bed_n) {
										arr.push([arr2[0], -1,arr2[1]]);
									} else {
										arr.push([arr2[0], val.bed_n - arr2[1],arr2[1]]);
									}
								});
								obj[val.hnum].push([arr1[0], arr, val.r_type_name, val.r_price]);
							});
						});
						this.bedDatas = obj;
						this.flag = true;
					}
				});
			}
		},
		data() {
			return {
				arr: [],
				sDatas: [],
				hnum: "",
				bedDatas: {},
				flag: false,
				onameDatas: [],
				oidDatas: [],
				emDatas: [],
				form: {
					ctime:new Date(),
					oname: "",
					oid: "",
					eaddress: "",
					em_n: "",
					yjf: "",
					grade: "",
					nprice: "",
					r_price: "",
					shprice: ""
				},
				rules: {
					oname: {
						required: true,
						message: "请填写姓名",
						tag: "blur"
					},
					oid: {
						required: true,
						message: "请填写编号",
						tag: "blur"
					},
					em_n: {
						required: true,
						message: "请选择年限",
						tag: "change"
					},
					eaddress: {
						required: true,
						message: "请选择位置",
						tag: "change"
					},
					shprice: {
						required: true,
						message: "请选择膳食标准",
						tag: "change"
					},
					yjf: {
						required: true,
						message: "请填写",
						tag: "blur"
					}
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.el-form-item {
		margin-right: 10px;
	}
	
	.yuan,
	.yuan1 {
		margin: 20px auto 0;
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
	}
	
	.yuan {
		background: red;
	}
	
	.yuan1 {
		background: greenyellow;
	}
	
	.time {
		font-size: 13px;
		color: #999;
	}
	
	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}
	
	.button {
		padding: 0;
		float: right;
	}
	
	.image {
		width: 100px;
		height: 80px;
		display: block;
	}
	
	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}
	
	.clearfix:after {
		clear: both;
	}
</style>