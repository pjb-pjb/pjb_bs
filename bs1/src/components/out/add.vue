<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules">
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
			<el-form-item label="离开时间" prop="otime">
				<el-date-picker v-model="form.otime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="陪护人" prop="nursename">
				<el-select v-model="form.nursename" placeholder="请选择" filterable>
					<el-option :key="index" :label="item.wname" :value="item.wname" v-for="(item,index) in nuresDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="外出事由" prop="outbecause">
				<el-input v-model="form.outbecause" type="text"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">提交</el-button>
				<el-button @click="quxiao">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				onameDatas: [],
				oidDatas: [],
				nuresDatas:[],
				form: {
					otime:"",
					oid:"",
					oname:"",
					nursename:"",
					outbecause:""
				},
				rules: {
					oname:[
						{
							required: true,
							message: "请选择老人姓名",
							trigger: "change"
						}
					],
					oid:[
						{
							required: true,
							message: "请选择老人编号",
							trigger: "change"
						}
					],
					otime:[
						{
							required: true,
							message: "请选择离开时间",
							trigger: "change"
						}
					],
					outbecause:[
						{
							required: true,
							message: "请填写",
							trigger: "blur"
						}
					]
				}
			}
		},
		methods: {
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
					}
				});
			},
			quxiao() {
				this.$router.go(-1);
			},
			onSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var params=`oid=${this.form.oid}&otime=${this.form.otime}&nursename=${this.form.nursename}&outbecause=${this.form.outbecause}`;
						fetch("/api/out/addSign?"+params,{
							credentials: 'include'
						}).then(function(e){
							return e.text();
						}).then((e)=>{
							if(e=="ok"){
								this.$router.push("/oldout");
								 this.$message({
								 	message:"添加成功",
								 	type:"success"
								 });
							}else{
								this.$message({
								 	message:"添加失败",
								 	type:"error"
								 });
							}
						});
					} else {
						return false;
					}
				});
			}
		},
		mounted() {
			fetch("/api/enter/selectAll2").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
			fetch("/api/out/selNurse").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message!="err"){
					this.nuresDatas=e;
				}
			});
		}
	}
</script>

<style scoped="scoped">

</style>