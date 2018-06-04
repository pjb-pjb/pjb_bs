<template>
	<el-table :data="tableData" border style="width: 100%">
		<el-table-column fixed type="index" width="223">
		</el-table-column>
		<el-table-column fixed prop="grade" label="等级" width="280">
		</el-table-column>
		<el-table-column fixed prop="nprice" label="价格" width="280">
		</el-table-column>
		<el-table-column label="操作" width="320">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="edit(scope.row)">设置价格</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default{
		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			fetch("/api/sys/selNurseInfo").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.tableData = e;
				}
			});
		},
		methods:{
			edit(item){
				this.$prompt('请输入价格', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[1-9]\d*$/,
					inputErrorMessage: '格式不正确'
				}).then(({
					value
				}) => {
					if(value == "" || value == item.r_price) {
						return;
					}
					fetch("/api/sys/editNursePrice?nid=" + item.nid + "&nprice=" + value).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							item.nprice = value;
						} else {
							this.$message({
								message: "操作失败",
								type: "error"
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});
				});
			}
		}
	}
</script>

<style>

</style>