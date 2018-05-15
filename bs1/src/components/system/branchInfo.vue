<template>
	<div class="root">
		<div style="display: inline-block;width: 100%;margin-bottom: 20px;text-align: right;">
			<el-button type="success" @click="add">添加</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="bid" width="223">
			</el-table-column>
			<el-table-column fixed prop="bname" label="部门名称" width="280">
			</el-table-column>
			<el-table-column fixed prop="bnum" label="部门编号" width="280">
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">
						<span v-if="scope.row.bstatus==0">取消</span>
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
				this.$router.push("/addBar");
			},
			handleClick(item) {
				var bstatus = "";
				if(item.bstatus == 0) {
					bstatus = -1;
				} else {
					bstatus = 0;
				}
				fetch("/api/sys/editBar1?bid=" + item.bid + "&bstatus=" + bstatus).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						item.bstatus = bstatus;
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
				this.$prompt('请输入部门名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					console.log(value);
					if(value == "" || value == item.bname) {
						return;
					}
					fetch("/api/sys/editBar2?bid=" + item.bid + "&bname=" + value).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							item.bname = value;
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
			fetch("/api/sys/selBarInfo").then(function(e) {
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