<template>
	<div class="root">
		<div style="display: flex;justify-content: space-between;">
			<h2 style="font-size: 20px;padding:0 0 20px 30px;">老人信息<span v-if="form.estatus=='1'" style="color: red;font-size: 14px;">(离开)</span></h2>
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
				<el-input v-model="form.onum" style="width: 217px;" :disabled="true" v-else></el-input>
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
		<el-button type="primary" @click="submit" v-if="!flag" style="margin-left: 30px;">完成</el-button>
		<el-button @click="qx" v-if="!flag">取消</el-button>
	</div>
</template>

<script>
	export default {
		mounted() {
			fetch("/api/enter/selectAll").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
		},
		methods: {
			qx() {
				this.flag = true;
				fetch("/api/enter/selectSign?oid=" + this.form.oid).then(function(e) {
					return e.json();
				}).then((e) => {
					for(let i in e[0]) {
						if(i == "otelnum" || i == "jtelnum") {
							e[0][i] = e[0][i].toString();
						}
						if(i in this.form) {
							this.form[i] = e[0][i];
						}
						if(i in this.form1) {
							this.form1[i] = e[0][i];
						}
					}
				});
			},
			edit() {
				if(this.form.oid==""||this.flag==false){
					return;
				}
				this.flag = false;
			},
			del() {

			},
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
						fetch("/api/enter/selectSign?oid=" + this.form.oid).then(function(e) {
							return e.json();
						}).then((e) => {
							if(e.message=="err"){
								return;
							}
							for(let i in e[0]) {
								if(i == "otelnum" || i == "jtelnum") {
									e[0][i] = e[0][i].toString();
								}
								if(i in this.form) {
									this.form[i] = e[0][i];
								}
								if(i in this.form1) {
									this.form1[i] = e[0][i];
								}
							}
							if(e[1].length==1){
								
							}
						});
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
						fetch("/api/enter/selectSign?oid=" + this.form.oid).then(function(e) {
							return e.json();
						}).then((e) => {
							console.log(e[0]);
							for(let i in e[0]) {
								if(i == "otelnum" || i == "jtelnum") {
									e[0][i] = e[0][i].toString();
								}
								if(i in this.form) {
									this.form[i] = e[0][i];
								}
								if(i in this.form1) {
									this.form1[i] = e[0][i];
								}
							}
						});
					}
				});
			},
			submit() {
				var n=0;
				this.$refs["form"].validate((valid) => {
					if(valid) {
						n++;
					}else{
						return false;
					}
				});
				this.$refs["form1"].validate((valid) => {
					if(valid) {
						n++;
					}else{
						return false;
					}
				});
				if(n!=2){
					this.$message({
						message:"*为必填项",
						type:"warning"
					});
					return;
				}
				var params = `etime=${this.form.etime}&oname=${this.form.oname}&onum=${this.form.onum}&osex=${this.form.osex}&otelnum=${this.form.otelnum}&obir=${this.form.obir}&oaddress=${this.form.oaddress}&marstatus=${this.form.marstatus}&jnum=${this.form1.jnum}&jname=${this.form1.jname}&jtelnum=${this.form1.jtelnum}&jaddress=${this.form1.jaddress}&bind=${this.form1.bind}&jsex=${this.form1.jsex}&eid=${this.form.eid}&jid=${this.form1.jid}`;
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
						this.flag=true;
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
				flag: true,
				oidDatas: [],
				onameDatas: [],
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
					eid:"",
					estatus:""
				},
				form1: {
					jnum: "",
					jname: "",
					jtelnum: "",
					jaddress: "",
					bind: "",
					jsex: "",
					jid:""
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
						tag: "blur",
						type: 'date'
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
</style>