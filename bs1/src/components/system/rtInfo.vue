<template>
	<div class="root">
		<div style="display: inline-block;width: 100%;margin-bottom: 20px;text-align: right;">
			<el-button type="success" @click="add">添加</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" prop="序号" width="223">
			</el-table-column>
			<el-table-column prop="r_type_name" label="类型" width="280">
			</el-table-column>
			<el-table-column prop="r_price" label="价格" width="280">
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">
						<span v-if="scope.row.r_status==0">取消</span>
						<span v-else style="color: red;">恢复</span>
					</el-button>
					<el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		methods: {
			add() {
				this.$router.push("/addRt");
			},
			handleClick(item) {
				var r_status = "";
				if(item.r_status == 0) {
					r_status = -1;
				} else {
					r_status = 0;
				}
				fetch("/api/sys/editRt1?rid=" + item.rid + "&r_status=" + r_status).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						item.r_status = r_status;
						this.$message({
							message: "操作成功",
							type: "success"
						});
					} else {
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			edit(item) {
				this.$prompt('请输入房间价格', '提示', {
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
					fetch("/api/sys/editRt2?rid=" + item.rid + "&r_price=" + value).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							item.r_price = value;
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
		},

		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			fetch("/api/sys/selRtInfo").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.tableData = e;
				}
			});
		}
	}
</script>
<style>
	th,
	td {
		text-align: center !important;
	}
</style>