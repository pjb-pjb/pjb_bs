<template>
	<div class="root" style="">
		<div style="display: flex;justify-content: space-between;">
			<h2 style="font-size: 20px;padding:0 0 20px 30px;">老人信息<span v-if="form.estatus=='-1'" style="color: red;font-size: 14px;">(离开)</span><span v-else-if="form.estatus=='0'" style="color: red;font-size: 14px;">(未评估)</span><span v-else-if="form.estatus=='2'" style="color: red;font-size: 14px;">(未签约)</span><span v-else-if="form.estatus=='1'" style="color: red;font-size: 14px;">(已签约)</span></h2>
			<div>
				<el-button type="primary" @click="edit">编辑</el-button>
			</div>
		</div>
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="oname">
				<el-select v-model="form.oname" placeholder="请选择" filterable @change="change" v-if="flag">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in onameDatas"></el-option>
				</el-select>
				<el-input v-model="form.oname" style="width: 217px;" v-else></el-input>
			</el-form-item>
			<el-form-item label="编号" prop="oid">
				<el-select v-model="form.oid" placeholder="请选择" filterable @change="change1" v-if="flag">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in oidDatas"></el-option>
				</el-select>
				<el-input v-model="form.oid" style="width: 217px;" :disabled="true" v-else></el-input>
			</el-form-item>
			<el-form-item label="身份证号" prop="onum">
				<el-input v-model="form.onum" style="width: 300px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="osex">
				<el-select v-model="form.osex" placeholder="请选择" :disabled="flag">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="生日" prop="obir">
				<el-date-picker type="date" placeholder="请选择" v-model="form.obir" style="width: 200px;" :disabled="flag"></el-date-picker>
			</el-form-item>
			<el-form-item label="联系电话" prop="otelnum">
				<el-input v-model="form.otelnum" style="width: 300px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="登记日期">
				<el-date-picker type="date" placeholder="请选择" v-model="form.etime" style="width: 220px;" :disabled="true"></el-date-picker>
			</el-form-item>
			<el-form-item label="家庭地址" prop="oaddress">
				<el-input v-model="form.oaddress" style="width: 500px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="婚姻状况" prop="marstatus">
				<el-select v-model="form.marstatus" placeholder="请选择" :disabled="flag">
					<el-option :label="item.name" :value="item.name" :key="index" v-for="(item,index) in marstatusDatas"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div style="width: 100%;height: 3px;background: #ccc;margin-bottom: 20px;"></div>
		<h2 style="font-size: 20px;padding:0 0 20px 30px;">家属信息</h2>
		<el-form ref="form1" :model="form1" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="jname">
				<el-input v-model="form1.jname" style="width: 200px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="身份证号" prop="jnum">
				<el-input v-model="form1.jnum" style="width: 300px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="jsex">
				<el-select v-model="form1.jsex" placeholder="请选择" :disabled="flag">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="关系" prop="bind">
				<el-select v-model="form1.bind" placeholder="请选择" style="width: 200px;" :disabled="flag">
					<el-option :label="item.name" :value="item.name" :key="index" v-for="(item,index) in bindDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话" prop="jtelnum">
				<el-input v-model="form1.jtelnum" style="width: 300px;" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="家庭地址" prop="jaddress">
				<el-input v-model="form1.jaddress" style="width: 500px;" :disabled="flag"></el-input>
			</el-form-item>
		</el-form>
		<div v-if="form2.ctime">
			<div style="width: 100%;height: 3px;background: #ccc;margin-bottom: 20px;"></div>
			<div>
				<h2 style="display: inline-block;font-size: 20px;padding:0 0 20px 30px;">缴费护理信息</h2>
				<el-button v-if="form2.em_n!=-1" @click="xy" type="warning" style="float: right;margin-right: 30px;">续约</el-button>
			</div>
			<el-form ref="form2" :model="form2" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
				<el-form-item label="签约时间">
					<el-date-picker type="date" placeholder="请选择" v-model="form2.ctime" style="width: 220px;" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="到期时间">
					<el-date-picker type="date" placeholder="请选择" v-model="form2.endtime" style="width: 220px;" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="签约年限" prop="em_n">
					<el-input :value="form2['em_n']=='-1'?'终生':form2.em_n" disabled></el-input>
				</el-form-item>
				<el-form-item label="位置" prop="eaddress">
					<el-input v-model="form2.eaddress" @focus="selAddress" readonly style="width: 217px;" v-if="!flag"></el-input>
					<el-input :value="form2.eaddress" disabled style="width: 217px;" v-else></el-input>
				</el-form-item>
				<el-form-item label="床位费">
					<el-input v-model="form2.r_price" disabled style="width: 217px;"></el-input>
				</el-form-item>
				<el-form-item label="剩余费用" prop="yjf">
					<el-input v-model="form2.yjf" type="number" disabled style="width: 217px;"></el-input>
				</el-form-item>
				<el-form-item label="膳食标准" prop="shprice">
					<el-select v-model="form2['shprice']" placeholder="请选择" filterable v-if="!flag">
						<el-option :key="index" :label="item['shprice']+'/月'" :value="item['shprice'].toString()" v-for="(item,index) in sDatas"></el-option>
					</el-select>
					<el-input :value="form2.shprice+'/月'" disabled style="width: 217px;" v-else></el-input>
				</el-form-item>
				<el-form-item label="护理等级" prop="grade">
					<el-input v-model="form2.grade" disabled style="width: 217px;"></el-input>
				</el-form-item>
				<el-form-item label="护理费" prop="grade_price">
					<el-input v-model="form2.nprice" disabled style="width: 217px;"></el-input>
				</el-form-item>
			</el-form>
			<div v-if="flag1" style="width: 100%;min-height: 1200px;background: rgba(255,255,255,1);position: absolute;z-index: 100;left: 0;top: 0;">
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
		<el-button type="primary" @click="submit" v-if="!flag" style="margin-left: 30px;">完成</el-button>
		<el-button @click="qx" v-if="!flag">取消</el-button>
	</div>
</template>

<script>
	export default {
		props: ["oidDatas", "onameDatas"],
		methods: {
			xy() {
				new Promise(function(resolve, reject) {
					fetch("/api/old/selEM1").then(function(e) {
						return e.json();
					}).then((e) => {
						if(e.message != "err") {
							resolve(e)
						}
					});
				}).then((e) => {
					var str = "";
					e.forEach((val) => {
						str += `<option value="${val.em_n}">${val.em_name}</option>`;
					});
					str = `<select class="sel" v-model="">${str}</select>`;
					this.$alert(str, '请选择续约年限', {
						dangerouslyUseHTMLString: true,
						callback: action => {
							var xynx = document.querySelector(".sel").value * 1;
							var str1=xynx==-1?"将终身续约":`将续约${xynx}年`;
							if(action == "confirm") {
								this.$confirm(str1, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
									center: true
								}).then(() => {
									fetch(`/api/old/xy?xynx=${xynx}&endtime=${this.form2.endtime}&em_n=${this.form2.em_n}&oid=${this.form.oid}`).then(function(e){
										return e.text();
									}).then((e)=>{
										if(e=="ok"){
											this.selInfo();
											this.$message({
												type: 'success',
												message: '续约成功'
											});
										}else{
											this.$message({
												type: 'error',
												message: '续约失败'
											});
										}
									});
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '续约取消'
									});
								});
							} else {
								this.$message({
									message: "续约取消",
									type: "info"
								});
							}
						}
					});
				});
			},
			qz(item, r_price, index, index1) {
				if(item[1] == -1) {
					this.$message({
						message: "该房间已满",
						type: "warning"
					});
					return;
				}
				this.arr = [this.hnum, index, index1];
				this.form2.eaddress = this.hnum + item[0];
				this.form2.r_price = r_price;
				this.flag1 = false;
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
									if(arr2[1] == val.rid) {
										arr.push([arr2[0], -1,arr2[1]]);
									} else {
										arr.push([arr2[0], val.rid - arr2[1], arr2[1]]);
									}
								});
								obj[val.hnum].push([arr1[0], arr, val.r_type_name, val.r_price]);
							});
						});
						this.bedDatas = obj;
						this.flag1 = true;
					}
				});
			},
			selInfo() {
				fetch("/api/enter/selectSign?oid=" + this.form.oid).then(function(e) {
					return e.json();
				}).then((e) => {
					for(let i in e[0]) {
						if(i == "otelnum" || i == "jtelnum" || i == "shprice") {
							e[0][i] = e[0][i].toString();
						}
						if(i == "eaddress") {
							this.oldEAddress[0] = e[0][i].substring(0, 1);
							this.oldEAddress[1] = e[0][i].substring(1);
						}
						if(i in this.form) {
							this.form[i] = e[0][i];
						} else if(i in this.form1) {
							this.form1[i] = e[0][i];
						} else if(i in this.form2) {
							this.form2[i] = e[0][i];
						}
					}
				});
			},
			qx() {
				this.flag = true;
				this.selInfo();
			},
			edit() {
				if(this.form.oid == "" || this.flag == false) {
					return;
				}
				this.flag = false;
				fetch("/api/old/selEm").then(function(e) {
					return e.json();
				}).then((e) => {
					this.emDatas = e[0];
					this.sDatas = e[1];
				});
			},
			change(val) {
				this.flag = true;
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
						this.selInfo();
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
						this.selInfo();
					}
				});
			},
			submit() {
				var n = 0;
				this.$refs["form"].validate((valid) => {
					if(valid) {
						n++;
					} else {
						return false;
					}
				});
				this.$refs["form1"].validate((valid) => {
					if(valid) {
						n++;
					} else {
						return false;
					}
				});
				if(n != 2) {
					this.$message({
						message: "*为必填项",
						type: "warning"
					});
					return;
				}
				var bedinfo = "";
				var oldbedinfo = "";
				if(this.form2.eaddress != this.oldEAddress.join("")) {
					var arr = this.arr;
					console.log(this.bedDatas[arr[0]][arr[1]][1][arr[2]]);
					this.bedDatas[arr[0]][arr[1]][1][arr[2]][1] = this.bedDatas[arr[0]][arr[1]][1][arr[2]][1]*1 - 1;
					this.bedDatas[arr[0]][arr[1]][1][arr[2]][2] = this.bedDatas[arr[0]][arr[1]][1][arr[2]][2] * 1 + 1;
					if(arr[0] == this.oldEAddress[0]) {
						this.bedDatas[arr[0]].forEach((item) => {
							var louceng = item[0];
							var str = "";
							item[1].forEach((val) => {
								console.log(val)
								if(val[0] == this.oldEAddress[1]) {
									val[2] = val[2] - 1;
								}
								str += val[0] + ":" + val[2] + ","
							});
							str = louceng + "." + str.slice(0, -1);
							bedinfo += str + "|"
						});
					} else {
						this.bedDatas[arr[0]].forEach((item) => {
							var louceng = item[0];
							var str = "";
							item[1].forEach((val) => {
								str += val[0] + ":" + val[2] + ","
							});
							str = louceng + "." + str.slice(0, -1);
							bedinfo += str + "|"
						});
						this.bedDatas[this.oldEAddress[0]].forEach((item) => {
							var louceng = item[0];
							var str = "";
							item[1].forEach((val) => {
								if(val[0] == this.oldEAddress[1]) {
									val[2] = val[2] - 1;
								}
								str += val[0] + ":" + val[2] + ","
							});
							str = louceng + "." + str.slice(0, -1);
							oldbedinfo += str + "|"
						});
					}
					bedinfo = bedinfo.slice(0, -1);
					oldbedinfo = oldbedinfo.slice(0, -1);
				}
				var params = `etime=${this.form.etime}&oname=${this.form.oname}&onum=${this.form.onum}&osex=${this.form.osex}&otelnum=${this.form.otelnum}&obir=${this.form.obir}&oaddress=${this.form.oaddress}&marstatus=${this.form.marstatus}&jnum=${this.form1.jnum}&jname=${this.form1.jname}&jtelnum=${this.form1.jtelnum}&jaddress=${this.form1.jaddress}&bind=${this.form1.bind}&jsex=${this.form1.jsex}&eid=${this.form.eid}&jid=${this.form1.jid}&bedinfo=${bedinfo}&oldbedinfo=${oldbedinfo}&r_price=${this.form2.r_price}&shprice=${this.form2.shprice}&newhnum=${this.arr[0]}&oldhnum=${this.oldEAddress[0]}&oid=${this.form.oid}&eaddress=${this.form2.eaddress}`;
				fetch("/api/enter/edit", {
					method: "post",
					body: params,
					headers: {
						"content-type": "application/x-www-form-urlencoded"
					}
				}).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						this.$message({
							message: "修改成功",
							type: "success"
						});
						this.oldEAddress[0] = this.form2.eaddress.substring(0, 1);
						this.oldEAddress[1] = this.form2.eaddress.substring(1);
						this.flag = true;
					} else {
						this.$message({
							message: "修改失败",
							type: "error"
						});
					}
				});
			}
		},
		data() {
			return {
				xynx: "",
				arr: [],
				hnum: "",
				oldEAddress: [],
				emDatas: [],
				sDatas: [],
				flag1: false,
				bedDatas: {},
				flag: true,
				form: {
					etime: "",
					oname: "",
					onum: "",
					osex: "",
					otelnum: "",
					obir: "",
					oaddress: "",
					marstatus: "",
					oid: "",
					eid: "",
					estatus: ""
				},
				form1: {
					jnum: "",
					jname: "",
					jtelnum: "",
					jaddress: "",
					bind: "",
					jsex: "",
					jid: ""
				},
				form2: {
					ctime: "",
					eaddress: "",
					em_n: "",
					yjf: "",
					grade: "",
					nprice: "",
					r_price: "",
					shprice: "",
					endtime: ""
				},
				rules: {
					oname: {
						required: true,
						message: "请填写姓名",
						tag: "blur"
					},
					onum: {
						required: true,
						message: "身份证号",
						tag: "blur"
					},
					osex: {
						required: true,
						message: "请选择性别",
						tag: "blur"
					},
					otelnum: {
						required: true,
						message: "请填写联系电话",
						tag: "blur"
					},
					obir: {
						required: true,
						message: "请填写生日",
						tag: "blur"
					},
					oaddress: {
						required: true,
						message: "请填写地址",
						tag: "blur",
					},
					marstatus: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					jname: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					jnum: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					jsex: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					bind: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					jtelnum: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					jaddress: {
						required: true,
						message: "请填写",
						tag: "blur",
					},
					eaddress: {
						required: true,
						message: "请填写",
						tag: "blur"
					},
					shprice: {
						required: true,
						message: "请填写",
						tag: "blur"
					}
				},
				marstatusDatas: [{
					name: "已婚"
				}, {
					name: "丧偶"
				}, {
					name: "离异"
				}],
				bindDatas: [{
					name: "母子"
				}, {
					name: "母女"
				}, {
					name: "父子"
				}, {
					name: "父母"
				}, {
					name: "兄弟姐妹"
				}]
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