<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="" label="序号" width="50" type="index">
			</el-table-column>
			<el-table-column prop="reptime" label="保修时间" width="200">
			</el-table-column>
			<el-table-column prop="wname" label="姓名" width="200">
			</el-table-column>
			<el-table-column prop="snote" label="原因" width="200">
			</el-table-column>
			<el-table-column prop="spos" label="位置" width="150">
			</el-table-column>
			<el-table-column label="操作" width="275">
				<template slot-scope="scope">
					<el-button @click="wc(scope.row.sid)" type="text" size="small">完成</el-button>
					<el-button type="text" size="small" @click="edit(scope.row.sid)">编辑</el-button>
					<el-button @click="handleClick(scope.row.sid)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<input type="hidden" v-model="a" />
		<div v-if="tableData.length>0">
			<el-pagination background layout="prev, pager, next" :total="pages*10" style="text-align: right;margin-top: 20px;margin-right: 20px;" @current-change="fanye">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			edit(sid) {
				this.$emit("edit","edit");
    			this.$store.state.sid=sid;
			},
			wc(sid) {
				fetch("/api/service/wc?sid=" + sid).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == 'ok') {
						this.$message({
							message: "操作成功",
							type: "success"
						});
						this.tableData = this.tableData.filter((val, index) => {
							return val.sid != sid;
						});
						this.$store.commit("setWc");
						console.log(this.$store.state.wc);
					} else {
						this.$message({
							message: "操作失败",
							type: "success"
						});
					}
				});
			},
			handleClick(sid) {
				this.$confirm('此信息将被彻底删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch("/api/service/delSign?sid=" + sid).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.tableData = this.tableData.filter((val, index) => {
								return val.sid != sid;
							});
							this.$message({
								message: "删除成功",
								type: "success"
							});
						} else {
							this.$message({
								message: "删除失败",
								type: "error"
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectAll() {
				fetch(`/api/service/selectAll?like=${this.like}&flag=0`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/service/selectPage?" + params + "&flag=0").then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						this.tableData = e;
					}
				});
			},
			find() {
				if(this.like == "" && this.flag == 0) {
					return;
				}
				if(this.like == "") {
					this.flag = 0;
				} else {
					this.flag = 1;
				}
				this.selectAll();
				this.selectPage();
			},
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			}
		},

		data() {
			return {
				tableData: [],
				pages: 1,
				page: 0,
				like: "",
				num: 0,
				flag: 0
			}
		},
		mounted() {
			this.selectAll();
			this.selectPage();
		},
		computed: {
			a() {
				this.selectAll();
				this.selectPage();
				return this.$store.state.wc;
			}
		}
	}
</script>
<style>
	th,
	td {
		text-align: center !important;
	}
	
	.el-table_1_column_7 .name-wrapper {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>