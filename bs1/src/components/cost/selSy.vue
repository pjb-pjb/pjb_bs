<template>
	<div class="root">
		<div style="float: left;margin-right: 10px;">
			<el-select v-model="isQf" placeholder="请选择" style="width: 100px;" @change="change">
				<el-option label="全部" value="0" key="0"></el-option>
				<el-option label="欠费" value="1" key="1"></el-option>
			</el-select>
		</div>
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="oname" label="姓名" width="200">
			</el-table-column>
			<el-table-column prop="oid" label="编号" width="300">
			</el-table-column>
			<el-table-column label="剩余费用" width="260">
				<template slot-scope="scope">
					<span v-if="scope.row.yjf>0">{{scope.row.yjf}}</span>
					<span v-else style="color: red;">{{"欠费"+scope.row.yjf*-1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="247">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edit(scope.row)">缴费</el-button>
					<el-button type="text" size="small" @click="selFy(scope.row.oid)">费用详情</el-button>
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
			selFy(oid) {
				this.$router.push("/fyxq?oid=" + oid);
			},
			change() {
				this.selectAll();
				this.selectPage();
			},
			selectAll() {
				fetch(`/api/cost/selectAll?like=${this.like}&isQf=${this.isQf}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page + "&isQf=" + this.isQf;
				fetch("/api/cost/selectPage?" + params).then(function(e) {
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
			edit(item) {
				this.$prompt('请输入缴费金额', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\d\.]*$/,
					inputErrorMessage: '格式输入有误'
				}).then(({
					value
				}) => {
					if(!(value * 1)) {
						return;
					}
					var oid = item.oid;
					var yjf = item.yjf;
					yjf = yjf * 1 + value * 1;
					fetch(`/api/cost/jf?oid=${oid}&yjf=${yjf}&jf=${value}`, {
						credentials: 'include'
					}).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							item.yjf = yjf;
							this.$message({
								type: 'success',
								message: '缴费成功'
							});
						} else {
							this.$message({
								type: 'error',
								message: '缴费失败'
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消缴费'
					});
				});
			},
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			},
			chakan(because) {
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
			if(this.$route.query.flag=="qf"){
				this.isQf="1";
			}
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