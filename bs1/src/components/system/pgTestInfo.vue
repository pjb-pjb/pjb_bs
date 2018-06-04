<template>
	<div>
		<el-button type="primary" @click="add" style="float: right;margin-bottom: 20px;">导入试题</el-button>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed type="index" width="303">
			</el-table-column>
			<el-table-column fixed prop="ptname" label="试题名称" width="380">
			</el-table-column>
			<el-table-column label="操作" width="420">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edit(-1,scope.row)" v-if="scope.row.ptstatus==0">点击停用</el-button>
					<el-button type="text" size="small" @click="edit(0,scope.row)" v-else style="color: red;">点击启用</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			fetch("/api/sys/selTestInfo").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.tableData = e;
				}
			});
		},
		methods:{
			add(){
				this.$router.push("/addTest");
			},
			edit(n,item){
				fetch("/api/sys/editPgTestInfo?ptstatus="+n+"&ptid="+item.ptid).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						item.ptstatus=n;
						this.$message({
							message:"操作成功",
							type:"success"
						});
					}else{
						this.$message({
							message:"操作失败",
							type:"error"
						});
					}
				});
			}
		}
	}
</script>

<style>
</style>