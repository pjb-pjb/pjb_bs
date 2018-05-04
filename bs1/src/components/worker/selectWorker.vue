<template>
	<div class="root">
		<div style="width:100%;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
			<div style="float:right;margin-right:20px;">
				<router-link to="/addSign">
					<el-button type="primary">单条添加</el-button>
				</router-link>
				<router-link to="/addMore">
					<el-button type="primary">批量添加</el-button>
				</router-link>
			</div>
		</div>
		<el-table :data="tableData" border style="width: 100%;overflow:hidden;" :default-sort="{prop:'wnum',order:'ascending'}">
			<el-table-column  prop="wnum" label="编号" width="200">
			</el-table-column>
			<el-table-column  prop="wname" label="姓名" width="300">
			</el-table-column>
			<el-table-column  prop="bname" label="部门" width="300" sortable>
			</el-table-column>
			<el-table-column label="操作" width="257">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edit(scope.row.wid)">编辑</el-button>
					<el-button @click="handleClick(scope.row.wnum,scope.row.wname,scope.row.wid)" type="text" size="small">删除</el-button>
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
			handleClick(wnum,wname,wid) {
				this.$confirm(wname+'相关信息将被彻底删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch("/api/worker/delSign?wnum=" + wnum+"&wid="+wid).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.tableData = this.tableData.filter((val, index) => {
								console.log(val.wid,wid);
								return val.wid != wid;
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
				fetch(`/api/worker/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/worker/selectPage?" + params).then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						this.tableData = e;
					}
				});
			},
			find() {
				if(this.like==""&&this.flag==0)
				{
					return;
				}
				if(this.like==""){
					this.flag=0;
				}else{
					this.flag=1;
				}
				this.selectAll();
				this.selectPage();
			},
			edit(wid) {
				this.$router.push("/editWorker?wid=" + wid);
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