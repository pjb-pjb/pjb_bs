<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名">
				<el-select v-model="form.oname" placeholder="请选择" filterable @change="change" :disabled="!flag">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in onameDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="编号">
				<el-select v-model="form.oid" placeholder="请选择" filterable @change="change1" :disabled="!flag">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in oidDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="评估分数">
				<el-input v-model="form.pscore" style="width: 300px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="护理等级">
				<el-input v-model="form.grade" style="width: 217px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="评估时间">
				<el-input v-model="form.ptime" style="width: 217px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="体重(kg)" prop="weight">
				<el-input v-model="form.weight" style="width: 300px" :disabled="flag" type="number" ma></el-input>
			</el-form-item>
			<el-form-item label="过敏药物" prop="gmyw">
				<el-input v-model="form.gmyw" style="width: 600px" :disabled="flag"></el-input>
			</el-form-item>
			<el-form-item label="疾病史" prop="disease">
				<el-input v-model="form.disease" style="width: 800px" :disabled="flag"></el-input>
			</el-form-item>
			<el-button v-if="isPg" type="primary" @click="pg" style="margin-left: 10px;height: 40px;">{{isPg}}</el-button>
		</el-form>
		<div>
			<router-view to="/pgtest">
				<el-button type="primary" @click="tj" style="margin-left: 10px;height: 40px;">提交</el-button>
			</router-view>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			fetch("/api/enter/selectAll3").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
		},
		methods: {
			time(time) {
				var year = time.getFullYear() >= 10 ? time.getFullYear() : "0" + time.getFullYear();
				var mon = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
				var day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
				var hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours();
				var min = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes();
				var sec = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds();
				return year + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + sec;
			},
			pg() {
				if(this.isPg == "取消") {
					fetch("/api/pg/selPgInfo?oid=" + this.form.oid).then(function(e) {
						return e.json();
					}).then((e) => {
						if(e.message != "err") {
							this.flag = true;
							this.isPg == "";
							this.$router.push("/enterPg");
							if(e.length == 0) {
								this.isPg = "点击评估";
								for(let i in this.form) {
									if(i == 'oid' || i == 'oname') {
										continue;
									}
									this.form[i] = "";
								}
							} else {
								this.isPg = "重新评估";
								for(let i in this.form) {
									if(i == 'oid' || i == 'oname') {
										continue;
									}
									this.form[i] = e[0][i];
									if(i == 'weight') {
										this.form[i] = this.form[i].toString();
									}
								}
							}
						}
					});
					return;
				}
				this.$router.push("/pgtest");
				this.flag = false;
				this.form.ptime = this.time(new Date());
				this.form.grade = "将根据评分自动生成";
				this.isPg = "取消";
			},
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
						this.$store.state.oid = this.form.oid;
						fetch("/api/pg/selPgInfo?oid=" + this.form.oid).then(function(e) {
							return e.json();
						}).then((e) => {
							if(e.length == 1) {
								this.flag1 = 1;
								this.isPg = "重新评估";
								for(let i in e[0]) {
									if(i in this.form) {
										this.form[i] = e[0][i];
									}
								}
							} else {
								this.flag1 = 0;
								this.isPg = "点击评估";
							}
						});
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
						this.$store.state.oid = this.form.oid;
						fetch("/api/pg/selPgInfo?oid=" + this.form.oid).then(function(e) {
							return e.json();
						}).then((e) => {
							if(e.length == 1) {
								this.flag1 = 1;
								this.isPg = "重新评估";
								for(let i in e[0]) {
									if(i in this.form) {
										this.form[i] = e[0][i];
									}
								}
							} else {
								this.flag1 = 0;
								this.isPg = "点击评估";
							}
						});
					}
				});
			},
			tj() {
				this.$refs["form"].validate((valid) => {
					if(valid) {
						if(!this.$store.state.isAll) {
							this.$message({
								message: "请认真评估",
								type: "warning"
							});
							return;
						}
						var params = `oid=${this.form.oid}&pscore=${this.form.pscore}&ptime=${this.form.ptime}&weight=${this.form.weight}&gmyw=${this.form.gmyw}&disease=${this.form.disease}`;
						var str = "";
						if(this.flag1 == 0) {
							str = "/api/pg/addSign?" + params;
						} else {
							str = "/api/pg/edit?" + params + "&pid=" + this.form.pid;
						}
						fetch(str,{
							credentials: 'include'
						}).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.flag = true;
								this.isPg = "重新评估";
								this.form.weight=this.form.weight.toString();
								this.$router.push("/enterPg");
								this.$message({
									message: "评估成功",
									type: "success"
								});
							} else {
								this.$message({
									message: "评估失败",
									type: "error"
								});
							}
						});
					} else {
						this.$message({
							message: "*为必填项",
							type: "warning"
						});
						return false;
					}
				});
			}

		},
		data() {
			return {
				nprice:[],
				flag: true,
				oidDatas: [],
				onameDatas: [],
				form: {
					oid: "",
					oname: "",
					pscore: "",
					grade: "",
					ptime: "",
					weight: "",
					gmyw: "",
					disease: "",
					pid:""
				},
				isPg: "",
				flag1: 0
			}
		},
		computed: {
			rules() {
				var validateWeight = (rule, value, callback) => {
					if(value < 20) {
						callback(new Error('这也太轻了吧，请重新输入'));
					} else {
						callback();
					}
				};
				var str = "请填写";
				return {
					weight: [{
						required: !this.flag,
						trigger: "blur",
						message: str
					}, {
						validator: !this.flag ? validateWeight : "",
						trigger: 'blur'
					}],
					gmyw: [{
						required: !this.flag,
						trigger: "blur",
						message: str
					}],
					disease: [{
						required: !this.flag,
						trigger: "blur",
						message: str
					}]

				}
			}
		},
		watch: {
			'$store.state.score' (val) {
				this.form.pscore = val;
				if(val>=180){
					this.form.grade='三级';
				}else if(val<180&&val>=160){
					this.form.grade="二级";
				}else if(val<160&&val>=140){
					this.form.grade="一级";
				}else{
					console.log()
					this.form.grade="特殊";
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.el-form-item {
		margin-right: 10px;
	}
</style>