<template>
	<div class="root">
		<div style="display: inline-block;width: 100%;margin-bottom: 20px;text-align: right;">
			<el-button type="success" @click="add">添加</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" label="序号" width="363">
			</el-table-column>
			<el-table-column  prop="em_name" label="部门名称" width="420">
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">
						<span v-if="scope.row.em_status==0">取消</span>
						<span v-else style="color: red;">恢复</span>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		methods: {
			add() {
				this.$router.push("/addEm");
			},
			handleClick(item) {
				var em_status = "";
				if(item.em_status == 0) {
					em_status = -1;
				} else {
					em_status = 0;
				}
				fetch("/api/sys/editEm?em_id=" + item.em_id + "&em_status=" + em_status).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						item.em_status = em_status;
						this.$message({
							message: "操作成功",
							type: "success"
						});
					} else {
						thus.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			}
		},
		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			fetch("/api/sys/selEmInfo").then(function(e) {
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