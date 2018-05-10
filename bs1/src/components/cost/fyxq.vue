<template>
	<div class="root">
		<div style="float: left;margin-right: 10px;">
			<el-select v-model="isQf" placeholder="请选择" style="width: 100px;" @change="change">
				<el-option label="全部" value="2" key="0"></el-option>
				<el-option label="消费" value="1" key="1"></el-option>
				<el-option label="缴费" value="0" key="2"></el-option>
			</el-select>
		</div>
		<div style="float: right;margin-bottom: 20px;">
			<el-button size="small" @click="fh">返回</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="oname" label="姓名" width="224">
			</el-table-column>
			<el-table-column prop="costamount" label="金额" width="400">
			</el-table-column>
			<el-table-column label="说明" width="400">
				<template slot-scope="scope">
					<span v-if="scope.row.coststatus==0">{{scope.row.cost_method}}</span>
					<span v-else style="color: red;">{{scope.row.cost_method}}</span>
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
			fh(){
				this.$router.go(-1);
			},
			selFy(oid){
				this.$router.push("/fyxq");
			},
			change() {
				this.selectAll();
				this.selectPage();
			},
			selectAll() {
				fetch(`/api/cost/selCostAll?like=${this.like}&isQf=${this.isQf}&oid=${this.$route.query.oid}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page + "&isQf=" + this.isQf+`&oid=${this.$route.query.oid}`;
				fetch("/api/cost/selCostPage?" + params).then(function(e) {
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