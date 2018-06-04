<template>
	<el-table :data="tableData" border style="width: 100%">
		<el-table-column fixed type="index" width="303">
		</el-table-column>
		<el-table-column fixed prop="shprice" label="膳食费/月" width="380">
		</el-table-column>
		<el-table-column label="操作" width="420">
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
			fetch("/api/sys/selShanshiInfo").then(function(e) {
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
					fetch("/api/sys/editShprice?shid=" + item.shid + "&shprice=" + value).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							item.shprice = value;
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