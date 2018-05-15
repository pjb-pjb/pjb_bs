<template>
	<div class="root">
		<div style="float: left;margin-right: 10px;">
			<el-select v-model="isQf" placeholder="请选择" style="width: 100px;" @change="change">
				<el-option label="全部" value="2" key="2"></el-option>
				<el-option label="未返回" value="0" key="0"></el-option>
				<el-option label="已返回" value="1" key="1"></el-option>
			</el-select>
		</div>
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<div style="float: right;">
			<el-button type="primary" @click="add">添加</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="50" fixed>
			</el-table-column>
			<el-table-column prop="oname" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="oid" label="编号" width="110">
			</el-table-column>
			<el-table-column prop="otime" label="离开时间" width="200">
			</el-table-column>
			<el-table-column prop="backtime" label="归来时间" width="200">
			</el-table-column>
			<el-table-column prop="nursename" label="陪同人员" width="100">
			</el-table-column>
			<el-table-column prop="outbecause" label="外出事由" width="300">
			</el-table-column>
			<el-table-column label="状态" width="100" fixed="right" v-if="isQf==2">
				<template slot-scope="scope">
					<span>{{scope.row.ostatus==0?"未返回":"已返回"}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150" fixed="right" v-if="isQf!=1">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edit(scope.row)" v-if="scope.row.ostatus==0">确认返回</el-button>
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
			add() {
				this.$router.push("/oldoutadd");
			},
			change() {
				this.selectAll();
				this.selectPage();
			},
			selectAll() {
				fetch(`/api/out/selectAll?like=${this.like}&isQf=${this.isQf}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page + "&isQf=" + this.isQf;
				fetch("/api/out/selectPage?" + params).then(function(e) {
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
			},
			edit(item) {
				var time = this.time(new Date());
				fetch("/api/out/qrfh?oid=" + item.oid + "&backtime=" + time, {
					credentials: 'include'
				}).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						this.$message({
							message: "操作成功",
							type: "success"
						});
						item.ostatus = 1;
						item.backtime = time;
					} else {
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			time(time) {
				var year = time.getFullYear() > 10 ? time.getFullYear() : "0" + time.getFullYear();
				var mon = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
				var day = time.getDate() > 10 ? time.getDate() : "0" + time.getDate();
				var hours = time.getHours() > 0 ? time.getHours() : "0" + time.getHours();
				var min = time.getMinutes() > 0 ? time.getMinutes() : "0" + time.getMinutes();
				var sec = time.getSeconds() > 0 ? time.getSeconds() : "0" + time.getSeconds();
				return year + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + sec;
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
				isQf: "2"
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