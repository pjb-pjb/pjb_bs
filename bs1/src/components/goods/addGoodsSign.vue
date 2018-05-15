<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="物品名称">
				<el-input v-model="form.gname"></el-input>
			</el-form-item>
			<el-form-item label="物品编号">
				<el-input v-model="form.gnum"></el-input>
			</el-form-item>
			<el-form-item label="物品数量">
				<el-input v-model="form.gamount" type="number"></el-input>
			</el-form-item>
			<el-form-item label="物品单价">
				<el-input v-model="form.eprice" type="number"></el-input>
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
					gnum: "",
					gamount: "",
					eprice: ""
				}
			}
		},
		methods: {
			quxiao() {
				this.$router.push("/selectGoods");
			},
			onSubmit() {
				if(this.form.gname == "" || this.form.gnum == "" || this.form.gamount == "" || this.form.gprice == "") {
					this.$message({
						message: "请完善信息",
						type: "warning"
					});
					return;
				}
				var params = `gname=${this.form.gname}&gnum=${this.form.gnum}&gamount=${this.form.gamount}&eprice=${this.form.eprice}`;
				fetch("/api/goods/addSign?" + params, {
					credentials: 'include'
				}).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						this.$message({
							message: "添加成功",
							type: "success"
						});
						this.$router.push("/selectGoods");
					} else {
						this.$message({
							message: "添加失败",
							type: "error"
						});
					}
				});
			}
		},
		mounted() {

		}
	}
</script>

<style scoped="scoped">

</style>