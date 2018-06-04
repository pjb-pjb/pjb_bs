<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px" style="display: flex;flex-wrap: wrap;align-items: flex-start;">
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
		</el-form>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="index" width="100">
			</el-table-column>
			<el-table-column prop="did" label="医嘱编号" width="200">
			</el-table-column>
			<el-table-column prop="dtime" label="开嘱时间" width="200">
			</el-table-column>
			<el-table-column prop="d_type" label="类型" width="200">
			</el-table-column>
			<el-table-column prop="wname" label="开嘱人" width="200">
			</el-table-column>
			<el-table-column label="操作" width="203">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="chakan(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="box" style="position: fixed;left: 0;top: 0;background: rgba(0,0,0,0.8);z-index: 100;width: 100%;height: 100%;" v-if="flag" @click="qx($event)">
			<el-table :data="tableData1" border style="background: none;width: 1003px;margin: 0 auto;margin-top: 70px;">
				<el-table-column label="" prop="a" width="100">
				</el-table-column>
				<el-table-column label="结束时间" prop="d_endtime" width="200">
				</el-table-column>
				<el-table-column label="内容" prop="dcontent" width="700">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>export default {
	data() {
		return {
			form: {
				oid: "",
				oname: "",
			},
			oidDatas: [],
			onameDatas: [],
			tableData: [],
			oldDatas: [],
			newDatas:{},
			tableData1:{},
			flag:false
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
		qx(e){
			if(e.target.classList.contains("box")){
				this.flag=false;
			}
		},
		chakan(item) {
			var arr1=item.old.split("&&");
			var arr2=item.new.split("&&");
			this.oldDatas={
				a:"修改前",
				d_endtime:arr1[1],
				dcontent:arr1[0]
			}
			this.newDatas={
				a:"修改后",
				d_endtime:arr2[1],
				dcontent:arr2[0]
			}
			this.tableData1=[this.oldDatas,this.newDatas];
			this.flag=true;
		},
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
			fetch("/api/yz/selEditInfo?oid=" + this.form.oid).then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.tableData = e;
				}
			});
		},
		ty(item) {
			fetch("/api/yz/ty?did=" + item.did, {
				credentials: 'include'
			}).then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message == "ok") {
					this.$message({
						message: "操作成功",
						type: "success"
					});
					item.d_status = -1;
					item.d_endtime = e.d_endtime;
				} else {
					this.$message({
						message: "操作失败",
						type: "error"
					});
				}
			});
		}
	}
}</script>

<style>
	
</style>