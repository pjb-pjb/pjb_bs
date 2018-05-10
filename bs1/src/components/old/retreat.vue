<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="oname" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="oid" label="编号" width="110">
			</el-table-column>
			<el-table-column prop="yjf" label="剩余费用" width="100">
			</el-table-column>
			<el-table-column prop="ctime" label="签约时间" width="200">
			</el-table-column>
			<el-table-column prop="endtime" label="结束时间" width="200">
			</el-table-column>
			<el-table-column label="操作" width="297">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="tz(scope.row)">退住结算</el-button>
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
			selFy(oid){
				this.$router.push("/fyxq?oid="+oid);
			},
			change() {
				this.selectAll();
				this.selectPage();
			},
			selectAll() {
				fetch(`/api/retreat/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/retreat/selectPage?" + params).then(function(e) {
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
			tz(item) {
				var now=new Date();
				if(now.getDate()==1){
					this.$message({
						message:"每月一号不能办理退住",
						type:"warning"
					});
					return;
				}
				this.$router.push("/jsInfo/"+item.oid);
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
				flag: 0,
				isQf: "0"
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