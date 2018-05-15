<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;align-items: flex-start;">
			<el-form-item label="姓名" prop="oname">
				<el-select v-model="form.oname" placeholder="请选择" filterable @change="change">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in onameDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="编号" prop="oid">
				<el-select v-model="form.oid" placeholder="请选择" filterable @change="change1">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in oidDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="体重(kg)" prop="weight">
				<el-input v-model="form.weight" readonly style="width: 217px;"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="add">新增</el-button>
			</el-form-item>
			<el-form-item label="过敏药物" prop="gmyw">
				<el-input v-model="form.gmyw" readonly style="width: 1000px;"></el-input>
			</el-form-item>
			<el-form-item label="疾病史" prop="disease">
				<el-input v-model="form.disease" readonly style="width: 1000px;"></el-input>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="did" label="编号" width="100">
			</el-table-column>
			<el-table-column prop="dtime" label="开嘱时间" width="200">
			</el-table-column>
			<el-table-column prop="d_endtime" label="结束时间" width="200">
			</el-table-column>
			<el-table-column prop="dcontent" label="医嘱内容" width="500">
			</el-table-column>
			<el-table-column label="状态" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.d_status==0" style="color: greenyellow;">使用中</span>
					<span v-else style="color: red;">停用</span>
				</template>
			</el-table-column>
			<el-table-column prop="d_type" label="类型" width="100">
			</el-table-column>
			<el-table-column prop="wname" label="开嘱人" width="100">
			</el-table-column>
			<el-table-column label="操作" width="115" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="ty(scope.row)" v-if="scope.row.d_endtime==''">点击停用</el-button>
					<el-button type="text" size="small" @click="edit(scope.row.did)" v-if="scope.row.d_status==0">修改</el-button>
				</template>
			</el-table-column>
			{{a}}
		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					oid: "",
					oname: "",
					weight: "",
					gmyw: "",
					disease: ""
				},
				rules: {

				},
				oidDatas: [],
				onameDatas: [],
				tableData: [],
				oid:""
			}
		},
		mounted() {
			fetch("/api/enter/selectAll2").then(function(e) {
				return e.json();
			}).then((e) => {
				this.oidDatas = [];
				this.onameDatas = [];
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
		},
		methods: {
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
						this.selInfo();
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
						this.selInfo();
					}
				});
			},
			selInfo() {
				fetch("/api/yz/selInfo?oid=" + this.form.oid).then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						for(let i in e[0][0]) {
							this.form[i] = e[0][0][i];
						}
						e[1].forEach((val, index) => {
							if(val.d_endtime == "") {
								val.d_status = 0;
							} else if(new Date().getTime() >= new Date(val.d_endtime).getTime()) {
								val.d_status = -1;
							} else {
								val.d_status = 0;
							}
						});
						this.tableData = e[1];
					}
				});
			},
			add() {
				if(this.form.oid) {
					this.$router.push("/addYz/" + this.form.oid);
				}
			},
			ty(item) {
				fetch("/api/yz/ty?did="+item.did,{
					credentials: 'include'
				}).then(function(e){
					return e.json();
				}).then((e) => {
					if(e.message == "ok") {
						this.$message({
							message: "操作成功",
							type: "success"
						});
						item.d_status=-1;
						item.d_endtime=e.d_endtime;
					} else {
						this.$message({
							message: "操作失败",
							type: "error"
						});
					}
				});
			},
			edit(did){
				this.$router.push("/editYz/"+did);
			}
		},
		computed: {
			a() {
				if(this.$store.state.oid1 == "") {
					return;
				}
				this.form.oid = this.$store.state.oid1;
				this.oidDatas.forEach((e, index) => {
					if(this.$store.state.oid1 == e) {
						this.form.oname = this.onameDatas[index];
						this.selInfo();
						this.$store.state.oid1="";
					}
				});
				return this.$store.state.oid1;
			}
		}
	}
</script>

<style>

</style>