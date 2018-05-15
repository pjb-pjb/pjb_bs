<template>
	<div>
		<el-form  ref="form" :model="form" label-width="100px" :rules="rules">
			<el-form-item label="密码:" prop="upass">
				<el-input v-model="form.upass" type="password" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="确认密码:" prop="upass1">
				<el-input v-model="form.upass1" type="password" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="wname">
				<el-select v-model="form.wname" filterable placeholder="请选择">
					<el-option v-for="(item,index) in workerDatas" :key="index" :label="item.wname" :value="item.wname">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="账号权限" prop="ustatus">
				<el-select v-model="form.ustatus" filterable placeholder="请选择">
					<el-option key="0" label="超级管理员" value="0"></el-option>
					<el-option key="1" label="医护管理员" value="1"></el-option>
					<el-option key="2" label="后勤管理员" value="2"></el-option>
					<el-option key="3" label="安保管理员" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="sub">提交</el-button>
				<el-button @click="fh">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			var a = (rule, value, callback) => {
				if(!/^[\da-zA-Z]{6,10}$/.test(value)){
					callback(new Error('格式有误'));
				}else if(!/[a-zA-Z]/.test(value)){
					callback(new Error('格式有误'));
				}
				else {
					callback();
				}
			};
			var b = (rule, value, callback) => {
				if(this.form.upass!=value){
					callback(new Error('两次密码输入不一致'));
				}
				else {
					callback();
				}
			};
			return {
				workerDatas:[],
				form:{
					upass:"",
					upass1:"",
					wname:"",
					ustatus:""
				},
				rules:{
					upass:[{
						required: true,
						message: "请填写",
						tag: "blur"
					},{
						validator: a, 
						trigger: 'blur' 
					}],
					upass1:[{
						required: true,
						message: "请填写",
						tag: "blur"
					},{
						validator: b, 
						trigger: 'blur' 
					}],
					wname:[{
						required: true,
						message: "请选择",
						tag: "change"
					}],
					ustatus:[{
						required: true,
						message: "请选择",
						tag: "change"
					}]
				}
			}
		},
		methods:{
			fh(){
				this.$router.go("-1");
			},
			sub(){
				this.$refs["form"].validate((valid) => {
					if(valid) {
						var uname=this.$route.params.uname;
						var arr={"a":0,"g":1,"d":2,"c":3,"p":4,"z":5,"y":6,"q":7,"l":8,"h":9};
						uname=uname.split("");
						uname.forEach((val,index)=>{
							uname[index]=arr[val];
						});
						fetch(`/api/sys/addUser?upass=${this.form.upass}&wname=${this.form.wname}&ustatus=${this.form.ustatus}&uname=${uname.join("")}`).then(function(e){
							return e.text();
						}).then((e)=>{
							if(e=="ok"){
								this.$message({
									message:"添加成功",
									type:"success"
								});
								this.$router.go("-1");
							}else{
								this.$message({
									message:"添加失败",
									type:"error"
								});
							}
						});
					}else{
						return false;
					}
				});
			}
		},
		mounted(){
			fetch("/api/sys/selWorkerInfo").then(function(e){
				return e.json();
			}).then((e)=>{
				console.log(e);
				if(e.message!="err"){
					this.workerDatas=e;
				}
			});
		}
	}
</script>

<style>
</style>