<template>
	<div class="root">
		<div style="display: inline-block;width: 400px;margin-bottom: 20px;">
			<input v-model="like" placeholder="搜索..." style="width: 300px;" @keydown.13="find" class="el-input__inner" />
			<el-button icon="el-icon-search" circle @click="find"></el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="gname" label="物品名称" width="150">
			</el-table-column>
			<el-table-column fixed prop="bname" label="部门名称" width="150" sortable>
			</el-table-column>
			<el-table-column fixed prop="oamount" label="数量" width="150" sortable>
			</el-table-column>
			<el-table-column fixed prop="wname" label="姓名" width="150">
			</el-table-column>
			<el-table-column fixed prop="otime" label="时间" width="300" sortable>
			</el-table-column>
			<el-table-column fixed prop="obecause" label="出库原因" width="155" sortable>
			</el-table-column>
			<!--<el-table-column label="操作" width="275">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addNum(scope.row)">添加库存</el-button>
					<el-button type="text" size="small" @click="edit(scope.row.gid)">编辑</el-button>
					<el-button @click="handleClick(scope.row.gid)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>-->
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
				fetch(`/api/ogoods/selectAll?like=${this.like}`).then(function(e) {
					return e.text();
				}).then((e) => {
					this.pages = e;
				})
			},
			selectPage() {
				var params = "like=" + this.like + "&page=" + this.page;
				fetch("/api/ogoods/selectPage?" + params).then(function(e) {
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