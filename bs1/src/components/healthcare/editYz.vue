<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules">
			<el-form-item label="结束时间" prop="d_endtime">
				<div>
					<el-date-picker v-model="form.d_endtime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="医嘱内容" prop="dcontent">
				<el-input type="textarea" autosize v-model="form.dcontent">
				</el-input>
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
					dcontent: "",
					d_endtime: "",
					oid:""
				},
				rules:{
					dcontent:[{
						required: true,
						message: "请填写",
						tag: "blur"
					}],
					d_endtime:[{
					}],
					d_type:[{
						required: true,
						message: "请选择",
						tag: "change"
					}]
				},
				wDatas:[]
			}
		},
		methods: {
			quxiao() {
				this.$router.go(-1);
			},
			onSubmit() {
				this.$refs["form"].validate((valid) => {
					if(valid) {
						var params = `dcontent=${this.form.dcontent}&d_endtime=${this.form.d_endtime}&did=${this.$route.params.did}`;
						fetch("/api/yz/editYz",{
							credentials: 'include',
							method:"post",
							body:params,
							headers:{
								"Content-Type":"application/x-www-form-urlencoded",
							}
						}).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.$message({
									message: "修改成功",
									type: "success"
								});
								this.$store.state.oid1=this.form.oid;
								console.log(this.form.oid);
								this.$router.go(-1);
							} else {
								this.$message({
									message: "修改失败",
									type: "error"
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
			fetch("/api/yz/selW").then(function(e){
				return e.json();
			}).then((e)=>{
				if(e.message!="err"){
					this.wDatas=e;
				}
			});
			fetch("/api/yz/selByDid?did="+this.$route.params.did).then(function(e){
				return e.json();
			}).then((e)=>{
				for(let i in this.form){
					this.form[i]=e[0][i];
				}
			});
		}
	}
</script>

<style scoped="scoped">

</style>