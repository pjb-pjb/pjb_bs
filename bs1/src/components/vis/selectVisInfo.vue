<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner"></input>
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="vid" label="id" width="50">
			</el-table-column>
			<el-table-column fixed prop="visname" label="姓名" width="80">
			</el-table-column>
			<el-table-column fixed prop="certype" label="证件类型" width="80">
			</el-table-column>
			<el-table-column fixed prop="cernum" label="证件号" width="200">
			</el-table-column>
			<el-table-column fixed prop="vistime" label="来访时间" width="200">
			</el-table-column>
			<el-table-column fixed prop="leatime" label="离开时间" width="200">
			</el-table-column>
			<el-table-column fixed prop="because" label="来访事由" width="193">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						{{scope.row.because}}
						<div slot="reference" class="name-wrapper">
							{{ scope.row.because }}
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row.vid)" type="text" size="small">删除</el-button>
					<el-button type="text" size="small" @click="edit(scope.row.vid)">编辑</el-button>
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
			handleClick(vid) {
				this.$confirm('此信息将被彻底删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch("/api/visitors/delSign?vid=" + vid).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.tableData.filter = this.tableData.filter((val, index) => {
								return val.vid != vid;
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
				fetch(`/api/visitors/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/visitors/selectPage?" + params).then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						this.tableData = e;
					}
				});
			},
			timeType(time) {
				var str = new Date(parseInt(time));
				var year = str.getFullYear() < 10 ? "0" + str.getFullYear() : str.getFullYear();
				var mon = str.getMonth() + 1 < 10 ? "0" + str.getMonth() : str.getMonth() + 1;
				var day = str.getDate() < 10 ? "0" + str.getDate() : str.getDate();
				var hours = str.getHours() < 10 ? "0" + str.getHours() : str.getHours();
				var min = str.getMinutes() < 10 ? "0" + str.getMinutes() : str.getMinutes();
				var sec = str.getSeconds() < 10 ? "0" + str.getSeconds() : str.getSeconds();
				return `${year}-${mon}-${day} ${hours}:${min}:${sec}`;
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
			edit(vid) {
				this.$router.push("/editVisInfo?vid=" + vid);
			},
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			},
			chakan(because) {
				console.log(11111);
			}
		},

		data() {
			return {
				tableData: [],
				pages: 1,
				page: 0,
				like: "",
				flag:0
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
	
 	.el-popover__reference{
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>