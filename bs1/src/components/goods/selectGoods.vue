<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%" :default-sort="{prop:'gamount',order:'ascending'}">
			<el-table-column fixed prop="gname" label="物品名称" width="200">
			</el-table-column>
			<el-table-column fixed prop="gnum" label="物品编号" width="300">
			</el-table-column>
			<el-table-column fixed prop="gamount" label="库存" width="300" sortable>
			</el-table-column>
			<el-table-column label="操作" width="275">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addNum(scope.row)">添加库存</el-button>
					<el-button type="text" size="small" @click="edit(scope.row.gid)">编辑</el-button>
					<el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div v-if="tableData.length>0">
			<el-pagination background layout="prev, pager, next" :total="pages*10" style="text-align: right;margin-top: 20px;margin-right: 20px;" @current-change="fanye">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			handleClick(item) {
				this.$confirm('此信息将被彻底删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch("/api/goods/delSign?gid=" + item.gid+"&gnum="+item.gnum, {
						credentials: 'include'
					}).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.tableData.filter = this.tableData.filter((val, index) => {
								return val.gid != item.gid;
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
				fetch(`/api/goods/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/goods/selectPage?" + params).then(function(e) {
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
			edit(gid) {
				this.$router.push("/editGoodsInfo?gid=" + gid);
			},
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			},
			chakan(because) {
				console.log(11111);
			},
			addNum(item) {
				this.$prompt('', '输入添加数量', {
					dangerouslyUseHTMLString: true,
					showInput: true,
					inputType: "number",
					inputPattern: /^[^\-]/
				}).then(({
					value
				}) => {
					if(value > 0) {
						var sum = parseInt(item.gamount) + parseInt(value);
						var params = `gid=${item.gid}&gnum=${item.gnum}&gamount=${sum}&eamount=${value}`;
						fetch("/api/goods/addNum?" + params, {
							credentials: 'include'
						}).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								item.gamount = sum;
								this.$message({
									type: 'success',
									message: '添加成功'
								});
							} else {
								this.$message({
									type: 'error',
									message: '添加失败'
								});
							}
						});
					}
				}).catch(() => {});
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