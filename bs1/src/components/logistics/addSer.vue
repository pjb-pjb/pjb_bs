<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="位置">
				<el-select v-model="form.hname" filterable placeholder="请选择" filterable @change="hChange">
					<el-option v-for="(item,index) in hoursDatas" :key="index" :label="item.hname" :value="item.hname">
					</el-option>
				</el-select>
				<el-select v-model="form.rnum" filterable placeholder="请选择" filterable>
					<el-option v-for="(item,index) in roomDatas" :key="index" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="姓名">
				<el-select v-model="form.wnum" filterable placeholder="请选择">
					<el-option v-for="item in workerDatas" :key="item.wnum" :label="item.wname" :value="item.wnum">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="原因">
				<el-input v-model="form.snote"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">提交</el-button>
				<el-button @click="quxiao">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
				return {
					form: {
						wnum: "",
						snote: "",
						hname:"",
						rnum:""
					},
					workerDatas:[],
					hoursDatas:[],
					roomDatas:[],
					roomDatas1:{}
				}
			},
			methods: {
				hChange(){
					this.roomDatas=this.roomDatas1[this.form.hname];
					this.form.rnum="";
				},
				quxiao(){
//					this.$router.push("/selectGoods");
				},
				onSubmit() {
					if(this.form.wnum==""||this.form.snote==""||this.form.hname==""||this.form.rnum==""){
						this.$message({
							message:"请完善信息",
							type:"warning"
						});
						return;
					}
					var params=`wnum=${this.form.wnum}&snote=${this.form.snote}&spos=${this.form.hname+this.form.rnum}`;
					fetch("/api/service/addSign?"+params).then(function(e){
						return e.text();
					}).then((e)=>{
						if(e=="ok"){
							this.$message({
								message:"添加成功",
								type:"success"
							});
							this.form.wnum="";
							this.form.snote="";
							this.form.hname="";
							this.form.rnum="";
							this.$emit("tz");
							this.$store.commit("setWc");
						}else{
							this.$message({
								message:"添加失败",
								type:"error"
							});
						}
					});
				}
			},
			mounted() {
				fetch("/api/bed/selectInfo").then(function(e){
					return e.json();
				}).then((e)=>{
					this.workerDatas=e.workerDatas;
					e.posDatas.forEach((val)=>{
						var obj={};
						obj.hname=val.hname;
						this.hoursDatas.push(obj);
						var arr=val.bedinfo.split("|");
						var obj2={};
						var arr2=[];
						arr.forEach((val1)=>{
							var arr1=val1.split(".")[1].split(",");
							arr1.forEach((val2)=>{
								arr2.push(val2.split(":")[0]);
							});
						});
						this.roomDatas1[val.hname]=arr2;
					});
				});
			}
	}
</script>

<style scoped="scoped">
	
</style>