<template>
	<div>
		<el-form ref="form" :model="form" label-width="100px" :rules="rules">
			<el-form-item label="入驻年限:" prop="em_n">
				<el-input v-model="form.em_n" type="text" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="sub">提交</el-button>
				<el-button @click="fh">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			var a = (rule, value, callback) => {
				if(value=="") {
					callback(new Error('请填写'));
				}else if(!/^[1-9]\d*$/.test(value)){
					callback(new Error('输入有误'));
				}
				else {
					callback();
				}
			};
			return {
				form: {
					em_n: ""
				},
				rules: {
					em_n: [,{ 
						validator: a, 
						trigger: 'blur' 
					}
				]
				}
			}
		},
		methods: {
			fh() {
				this.$router.go("-1");
			},
			sub() {
				this.$refs["form"].validate((valid) => {
					if(valid) {
						fetch(`/api/sys/addEm?em_n=${this.form.em_n}`).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.$message({
									message: "添加成功",
									type: "success"
								});
								this.$router.go("-1");
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
		}
	}
</script>

<style>

</style>