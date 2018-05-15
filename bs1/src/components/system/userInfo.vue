<template>
	<div class="root">
		<div style="display: inline-block;width: 100%;margin-bottom: 20px;text-align: right;">
			<el-button type="success" @click="add">添加</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed type="index" label="序号" width="100">
			</el-table-column>
			<el-table-column fixed prop="uname" label="账号" width="220">
			</el-table-column>
			<el-table-column fixed prop="wname" label="姓名" width="220">
			</el-table-column>
			<el-table-column fixed prop="qx" label="权限" width="243">
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">
						<span v-if="scope.row.isDel==0">停用</span>
						<span v-else style="color: red;">恢复</span>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		methods: {
			add() {
				var arr=["a","g","d","c","p","z","y","q","l","h"];
				var n=this.tableData[this.tableData.length-1].uname.toString();
				n=n.split("");
				n.forEach((val,index)=>{
					n[index]=arr[val];
				})
				this.$router.push("/addUser/"+n.join(""));
			},
			handleClick(item) {
				var isDel = "";
				if(item.isDel == 0) {
					isDel = -1;
				} else {
					isDel = 0;
				}
				fetch("/api/sys/editUser1?uid=" + item.uid + "&isDel=" + isDel).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						item.isDel = isDel;
						this.$message({
							message: "操作成功",
							type: "success"
						});
					} else {
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			edit(item) {
				this.$prompt('请输入部门名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					console.log(value);
					if(value == "" || value == item.bname) {
						return;
					}
					fetch("/api/sys/editBar2?bid=" + item.bid + "&bname=" + value).then(function(e) {
						return e.text();
					}).then((e) => {
						if(e == "ok") {
							this.$message({
								message: "操作成功",
								type: "success"
							});
							item.bname = value;
						} else {
							this.$message({
								message: "操作失败",
								type: "error"
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});
				});
			}
		},
		data() {
			return {
				tableData: []
			}
		},
		mounted() {
			fetch("/api/sys/selUserInfo").then(function(e) {
				return e.json();
			}).then((e) => {
				var obj={
					0:"超级管理员",
					1:"医护管理员",
					2:"后勤管理员",
					3:"安保管理员"
				};
				if(e.message != "err") {
					e.forEach((val)=>{
						val.qx=obj[val.ustatus];
					});
					this.tableData = e;
				}
			});
		}
	}
</script>
<style>
	th,
	td {
		text-align: center !important;
	}
</style>