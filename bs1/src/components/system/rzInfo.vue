<template>
	<div class="root">
		<div style="float: left;margin-right: 10px;">
			<el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="change">
			</el-date-picker>
		</div>
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="wname" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="uname" label="账号" width="120">
			</el-table-column>
			<el-table-column prop="cztype" label="说明" width="400">
			</el-table-column>
			<el-table-column prop="cztime" label="操作时间" width="200">
			</el-table-column>
			<el-table-column prop="ip" label="ip地址" width="213">
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
			change() {
				if(this.time==null){
					this.starttime="";
					this.endtime="";
				}else{
					this.starttime=new Date(this.time[0]).getTime();
					this.endtime=new Date(this.time[1]).getTime();
				}
				this.selectAll();
				this.selectPage();
			},
			selectAll() {
				fetch(`/api/sys/selRzAll?like=${this.like}&starttime=${this.starttime}&endtime=${this.endtime}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page + `&starttime=${this.starttime}&endtime=${this.endtime}`;
				fetch("/api/sys/selRzPage?" + params).then(function(e) {
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
				endtime:"",
				starttime:"",
				tableData: [],
				pages: 1,
				page: 0,
				like: "",
				num: 0,
				flag: 0,
				time: [],
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				}
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
</style>