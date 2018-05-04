<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules">
			<el-form-item label="名称" prop="fname">
				<el-input v-model="form.fname" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="价格" prop="fprice">
				<el-input v-model="form.fprice" placeholder="请输入" type="number"></el-input>
			</el-form-item>
			<el-form-item label="禁忌人群">
				<el-select v-model="form.taboo" placeholder="请选择" multiple style="width:500px;">
					<el-option v-for="(item,index) in tabooDatas" :key="item.name" :label="item.name" :value="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型">
				<el-select v-model="form.ftype" placeholder="请选择" multiple style="width:500px;">
					<el-option v-for="(item,index) in ftypeDatas" :key="item.name" :label="item.name" :value="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="说明">
				<el-input type="textarea" v-model="form.fnote"></el-input>
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
					fname: "",
					fprice: "",
					taboo: "",
					ftype: "",
					fnote: ""
				},
				tabooDatas: [{
					name: "糖尿病"
				}, {
					name: "高血压"
				}, {
					name: "低血压"
				}],
				ftypeDatas: [{
					name: "早餐"
				}, {
					name: "午餐"
				}, {
					name: "晚餐"
				}],
				rules: {
					fname: [{
							required: true,
							message: '请输入食物名称',
							trigger: 'blur'
						}
					],
					fprice:[{
						required:true,
						message:"请输入价格",
						trigger:"blur"
					}]
				}
				}
			},
			methods: {
					hChange() {
						this.roomDatas = this.roomDatas1[this.form.hname];
						this.form.rnum = "";
					},
					quxiao() {
						this.$emit("edit","sel");
					},
					onSubmit() {
						if(this.form.fname == "" || this.form.fprice == "") {
							this.$message({
								message: "*为必填项",
								type: "warning"
							});
							return;
						}
						var taboo="";
						var ftype="";
						this.form.taboo.forEach((val,index)=>{
							taboo+=this.tabooDatas[index].name+",";
						});
						this.form.ftype.forEach((val,index)=>{
							ftype+=this.ftypeDatas[index].name+",";
						});
						var params = `fname=${this.form.fname}&fprice=${this.form.fprice}&taboo=${taboo.slice(0,-1)}&ftype=${ftype.slice(0,-1)}&fnote=${this.form.fnote}&fid=${this.$store.state.fid}`;
						fetch("/api/food/edit?" + params).then(function(e) {
							return e.text();
						}).then((e) => {
							if(e == "ok") {
								this.$message({
									message: "修改成功",
									type: "success"
								});
								this.form.fname = "";
								this.form.fprice = "";
								this.form.taboo = "";
								this.form.ftype = "";
								this.form.fnote = "";
								this.$emit("tz");
								this.$emit("edit","sel");
							} else {
								this.$message({
									message: "修改失败",
									type: "error"
								});
							}
						});
					}
				},
				mounted() {
					fetch("/api/food/selByFid?fid="+this.$store.state.fid).then(function(e){
						return e.json();
					}).then((e)=>{
						this.form.fname = e[0].fname;
						this.form.fprice = e[0].fprice;
						this.form.fnote = e[0].fnote;
						var arr=[];
						var arr1=[];
						e[0].taboo.split(",").forEach((val)=>{
							this.tabooDatas.every((val1,index)=>{
								if(val==val1.name){
									arr.push(index+1);
									return false;
								}
								return true;
							});
						});
						this.form.taboo=arr;
						e[0].ftype.split(",").forEach((val)=>{
							this.ftypeDatas.every((val1,index)=>{
								if(val==val1.name){
									arr1.push(index+1);
									return false;
								}
								return true;
							});
						});
						this.form.ftype=arr1;
					});
				}
		}
</script>

<style scoped="scoped">

</style>