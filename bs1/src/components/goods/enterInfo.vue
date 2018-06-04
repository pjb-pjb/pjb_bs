<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed type="index" width="150">
			</el-table-column>
			<el-table-column fixed prop="gnum" label="物品编号" width="150">
			</el-table-column>
			<el-table-column fixed prop="gname" label="物品名称" width="150">
			</el-table-column>
			<el-table-column fixed prop="eamount" label="数量" width="150" sortable>
			</el-table-column>
			<el-table-column fixed prop="etime" label="时间" width="330" sortable>
			</el-table-column>
			<el-table-column fixed label="总价" width="150" sortable>
				<template slot-scope="scope">
					<span>{{scope.row.eamount*scope.row.eprice}}</span>
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
			selectAll() {
				fetch(`/api/egoods/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/egoods/selectPage?" + params).then(function(e) {
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
			fanye(currentPage) {
				this.page = currentPage - 1;
				this.selectPage();
			},
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
			console.log(1)
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