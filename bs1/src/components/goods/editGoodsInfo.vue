<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="物品名称">
				<el-input v-model="form.gname"></el-input>
			</el-form-item>
			<el-form-item label="物品编号">
				<el-input v-model="form.gnum"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">提交</el-button>
				<el-button @click="quxiao">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
				return {
					form: {
						gname: "",
						gnum: ""
					}
				}
			},
			methods: {
				quxiao(){
					this.$router.push("/selectGoods");
				},
				onSubmit() {
					if(this.form.gname==""||this.form.gnum==""){
						this.$message({
							message:"请完善信息",
							type:"warning"
						});
						return;
					}
					var params=`gname=${this.form.gname}&gnum=${this.form.gnum}&gid=${this.$route.query.gid}`;
					fetch("/api/goods/edit?"+params).then(function(e){
						return e.text();
					}).then((e)=>{
						if(e=="ok"){
							this.$message({
								message:"编辑成功",
								type:"success"
							});
							this.$router.push("/selectGoods");
						}else{
							this.$message({
								message:"编辑失败",
								type:"error"
							});
						}
					});
				}
			},
			mounted() {
				fetch("/api/goods/selectByGid?gid="+this.$route.query.gid).then(function(e){
					return e.json();
				}).then((e)=>{
					if(e.message=="err"){
						this.$router.push("/selectGoods");
					}else{
						this.form.gname=e[0].gname;
						this.form.gnum=e[0].gnum;
					}
				});
			}
	}
</script>

<style scoped="scoped">
	
</style>