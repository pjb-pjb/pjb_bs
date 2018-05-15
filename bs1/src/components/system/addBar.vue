<template>
	<div>
		<el-form  ref="form" :model="form" label-width="100px" :rules="rules">
			<el-form-item label="部门名称:" prop="bname">
				<el-input v-model="form.bname" type="text" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="部门编号:" prop="bnum">
				<el-input v-model="form.bnum" type="text" style="width: 300px;"></el-input>
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
			return {
				form:{
					bname:"",
					bnum:""
				},
				rules:{
					bname:[{
						required: true,
						message: "请填写",
						tag: "blur"
					}],
					bnum:[{
						required: true,
						message: "请填写",
						tag: "blur"
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
						fetch(`/api/sys/addBar?bname=${this.form.bname}&bnum=${this.form.bnum}`).then(function(e){
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
		}
	}
</script>

<style>
</style>