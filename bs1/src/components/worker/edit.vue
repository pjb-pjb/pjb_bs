<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules">
			<el-form-item label="姓名" prop="wname">
				<el-input v-model="form.wname" type="text"></el-input>
			</el-form-item>
			<el-form-item label="部门" prop="bnum">
				<el-select v-model="form.bnum" filterable placeholder="请选择" filterable>
					<el-option v-for="item in braDatas" :key="item.bnum" :label="item.bname" :value="item.bnum">
					</el-option>
				</el-select>
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
				form: {
					bnum: "",
					wname: ""
				},
				braDatas: [],
				rules: {
					wname: [{
							required: true,
							message: "请输入姓名",
							trigger: "blur"
						},
						{
							min: 2,
							max: 5,
							trigger: 'blur',
							message: "2-5个字符串"
						}
					],
					bnum: [{
						required: true,
						message: "请选择部门",
						trigger: "change"
					}],
				}
			}
		},
		methods: {
			quxiao() {
				this.$router.push("/selectWorker");
			},
			onSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var params = `wname=${this.form.wname}&bnum=${this.form.bnum}&wid=${this.$route.query.wid}`;
						fetch("/api/worker/edit?" + params).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.$router.push("/selectWorker");
								this.$message({
									message: "添加成功",
									type: "success"
								});
							} else {
								this.$message({
									message: "添加失败",
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
			fetch("/api/worker/selectBra").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message == "err") {
					this.$router.push("/selectWorker");
				} else {
					this.braDatas = e;
				}
			});
			fetch("/api/worker/selectByWid?wid=" + this.$route.query.wid).then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message == "err") {
					this.$router.push("/selectWorker");
				} else {
					this.form.wname = e[0].wname;
					this.form.bnum = e[0].bnum.toString();
				}
			});
		}
	}
</script>

<style scoped="scoped">

</style>