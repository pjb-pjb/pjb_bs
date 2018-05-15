<template>
	<div class="root">
		<input type="hidden" v-model="a" />
		<div style="display: inline-block;width: 100%;margin-bottom: 20px;display: flex;">
			<el-date-picker type="date" placeholder="请选择" v-model="cftime" style="width: 200px;" @change="change"></el-date-picker>
			<el-select v-model="cftime1" placeholder="请选择" @change="change">
				<el-option key="0" label="早餐" value="早餐"></el-option>
				<el-option key="1" label="午餐" value="午餐"></el-option>
				<el-option key="2" label="晚餐" value="晚餐"></el-option>
			</el-select>
			<input v-model="like" placeholder="搜索..." style="width: 300px;margin-left: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column label="序号" width="50" type="index">
			</el-table-column>
			<el-table-column prop="oname" label="姓名" width="160">
			</el-table-column>
			<el-table-column prop="eaddress" label="地址" width="160">
			</el-table-column>
			<el-table-column prop="fname" label="食物名称" width="160">
			</el-table-column>
			<el-table-column prop="dctime" label="点餐时间" width="160">
			</el-table-column>
			<el-table-column prop="cftime1" label="就餐时间" width="160">
			</el-table-column>
			<el-table-column label="操作" width="207">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row.order_id)" type="text" size="small">取消</el-button>
					<el-button @click="edit(scope.row.order_id)" type="text" size="small">确认送餐</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div>
			<div style="float: left;">
				<el-button @click="add" type="primary" size="small">点餐</el-button>
			</div>
			<div v-if="tableData.length>0" style="float: right;">
				<el-pagination background layout="prev, pager, next" :total="pages*10" style="text-align: right;margin-top: 20px;margin-right: 20px;" @current-change="fanye">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			add() {
				this.$router.push("/dc");
			},
			change() {
			},
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
			handleClick(id) {
				fetch("/api/dc/qx?order_id="+id).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						console.log(this.tableData);
						this.tableData=this.tableData.filter((val)=>{
							return val.order_id!=id;
						});
						this.$message({
							message: "操作成功",
							type: "success"
						});
					}else{
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			selectAll() {
				fetch(`/api/dc/selectAll?like=${this.like}&cftime=${this.cftime}&cftime1=${this.cftime1}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page + `&cftime=${this.cftime}&cftime1=${this.cftime1}`;
				fetch("/api/dc/selectPage?" + params).then(function(e) {
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
			edit(id) {
				fetch("/api/dc/qr?order_id="+id).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						this.tableData=this.tableData.filter((val)=>{
							return val.order_id!=id;
						});
						this.$message({
							message: "操作成功",
							type: "success"
						});
					}else{
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			},
			time() {
				var year = time.getFullYear() >= 10 ? time.getFullYear() : "0" + time.getFullYear();
				var mon = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
				var day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
				var hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours();
				var min = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes();
				var sec = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds();
				return year + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + sec;
			}
		},

		data() {
			return {
				cftime:new Date().getTime(),
				cftime1: "",
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
</style>