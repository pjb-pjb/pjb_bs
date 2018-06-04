<template>
	<div class="root">
		<h2 style="font-size: 20px;padding:0 0 20px 30px;">老人信息</h2>
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="oname">
				<el-input v-model="form.oname" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="身份证号" prop="onum">
				<el-input v-model="form.onum" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="osex">
				<el-select v-model="form.osex" placeholder="请选择">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="生日" prop="obir">
				<el-date-picker type="date" placeholder="请选择" v-model="form.obir" style="width: 200px;"></el-date-picker>
			</el-form-item>
			<el-form-item label="联系电话" prop="otelnum">
				<el-input v-model="form.otelnum" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="登记日期">
				<el-date-picker type="date" placeholder="请选择" v-model="form.etime" style="width: 220px;" disabled></el-date-picker>
			</el-form-item>
			<el-form-item label="家庭地址" prop="oaddress">
				<el-input v-model="form.oaddress" style="width: 500px;"></el-input>
			</el-form-item>
			<el-form-item label="婚姻状况" prop="marstatus" style="margin-left: 90px;">
				<el-select v-model="form.marstatus" placeholder="请选择">
					<el-option :label="item.name" :value="item.name" :key="index" v-for="(item,index) in marstatusDatas"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div style="width: 100%;height: 3px;background: #ccc;margin-bottom: 20px;"></div>
		<h2 style="font-size: 20px;padding:0 0 20px 30px;">家属信息</h2>
		<el-form ref="form1" :model="form1" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="jname">
				<el-input v-model="form1.jname" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="身份证号" prop="jnum">
				<el-input v-model="form1.jnum" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="jsex">
				<el-select v-model="form1.jsex" placeholder="请选择">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="关系" prop="bind">
				<el-select v-model="form1.bind" placeholder="请选择" style="width: 200px;">
					<el-option :label="item.name" :value="item.name" :key="index" v-for="(item,index) in bindDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话" prop="jtelnum">
				<el-input v-model="form1.jtelnum" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="家庭地址" prop="jaddress">
				<el-input v-model="form1.jaddress" style="width: 500px;"></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="submit()" style="margin-left: 30px;">提交</el-button>
		<el-button @click="cz()" style="margin-left: 30px;">重置</el-button>
	</div>
</template>

<script>
	export default {
		methods: {
			cz() {
				this.$refs["form"].resetFields();
				this.$refs["form1"].resetFields();
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
				var params = `etime=${this.form.etime}&oname=${this.form.oname}&onum=${this.form.onum}&osex=${this.form.osex}&otelnum=${this.form.otelnum}&obir=${this.form.obir}&oaddress=${this.form.oaddress}&marstatus=${this.form.marstatus}&jnum=${this.form1.jnum}&jname=${this.form1.jname}&jtelnum=${this.form1.jtelnum}&jaddress=${this.form1.jaddress}&bind=${this.form1.bind}&jsex=${this.form1.jsex}`;
				fetch("/api/enter/addSign", {
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
							message: "添加成功",
							type: "success"
						});
						this.$refs["form"].resetFields();
						this.$refs["form1"].resetFields();
						this.$emit("tz");
					} else {
						this.$message({
							message: "添加失败",
							type: "error"
						});
					}
				});
			}
		},
		data() {
			return {
				form: {
					etime: new Date(),
					oname: "",
					onum: "",
					osex: "",
					otelnum: "",
					obir: "",
					oaddress: "",
					marstatus: ""
				},
				form1: {
					jnum: "",
					jname: "",
					jtelnum: "",
					jaddress: "",
					bind: "",
					jsex: ""
				},
				form2: {

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