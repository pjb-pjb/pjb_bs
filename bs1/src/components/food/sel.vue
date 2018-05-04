<template>
	<div class="root">
		<input type="hidden" v-model="a"/>
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column  prop="" label="序号" width="50" type="index">
			</el-table-column>
			<el-table-column  prop="fname" label="名称" width="200">
			</el-table-column>
			<el-table-column  prop="fprice" label="价格" width="200">
			</el-table-column>
			<el-table-column  prop="taboo" label="禁忌人群" width="200">
			</el-table-column>
			<el-table-column  prop="ftype" label="类型" width="200">
			</el-table-column>
			<el-table-column label="操作" width="207">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row.fid)" type="text" size="small">删除</el-button>
					<el-button @click="edit(scope.row.fid)" type="text" size="small">编辑</el-button>
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
			wc(sid) {
				fetch().then(function(e) {
					return e.text();
				}).then(function(e) {
					if(e == 'ok') {
						this.$message({
							message: "操作成功",
							type: "success"
						});
					} else {
						this.$message({
							message: "操作失败",
							type: "success"
						});
					}
				});
			},
			handleClick(fid) {
				this.$confirm('此信息将被彻底删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch("/api/food/delSign?fid=" + fid).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.page=0;
							this.selectAll();
							this.selectPage();
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
				fetch(`/api/food/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/food/selectPage?" + params).then(function(e) {
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
			edit(fid) {
				this.$store.state.fid=fid;
				this.$emit("edit","edit");
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
		computed:{
			a(){
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