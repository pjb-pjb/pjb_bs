<template>
	<div class="root">
		<el-upload class="upload-demo" ref="upload" action="/api/sys/addTest" :file-list="fileList" :auto-upload="false" accept=".xlsx" :on-success="success" multiple="multiple" name="file">
			<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
			<div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
		</el-upload>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fileList: []
			};
		},
		methods: {
			success(res, file, fileList) {
				var filename=file.name.slice(0,-5);
				if(res == "ok") {
					this.$notify({
						title: '成功',
						message: filename+"添加成功",
						type: 'success'
					});
				}else{
					this.$notify({
						title: '成功',
						message: filename+"添加失败",
						type: 'error'
					});
				}
			},
			submitUpload() {
				this.$refs.upload.submit();
			}
		}
	}
</script>

<style scoped="scoped">

</style>