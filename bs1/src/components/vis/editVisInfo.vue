<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="姓名">
				<el-input v-model="form.visname"></el-input>
			</el-form-item>
			<el-form-item label="证件类型">
				<el-select v-model="form.certype" placeholder="请选择证件类型">
					<el-option :label="item.cername" :value="item.cername" v-for="item in certypeDatas" :key="item.cerid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证件号">
				<el-input v-model="form.cernum" type="number"></el-input>
			</el-form-item>
			<el-form-item label="来访时间">
				<div class="block">
					<el-date-picker v-model="form.vistime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="离开时间">
				<div class="block">
					<el-date-picker v-model="form.leatime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="来访原因">
				<el-input type="textarea" autosize placeholder="请输入原因..." v-model="form.because">
				</el-input>
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
						visname: "",
						certype: "身份证",
						cernum: "",
						vistime: "",
						leatime: "",
						because: ""
					},
					certypeDatas: []
				}
			},
			methods: {
				quxiao(){
					this.$router.push("/selectVisInfo");
				},
				onSubmit() {
					if(this.form.name==""||this.form.visname==""||this.form.certype==""||this.form.cernum==""||this.form.leatime==""||this.form.because==""){
						this.$message({
							message:"请完善信息",
							type:"warning"
						});
						return;
					}
					var params=`visname=${this.form.visname}&certype=${this.form.certype}&cernum=${this.form.cernum}&vistime=${this.form.vistime}&leatime=${this.form.leatime}&because=${this.form.because}&vid=${this.$route.query.vid}`;
					fetch("/api/visitors/edit?"+params).then(function(e){
						return e.text();
					}).then((e)=>{
						if(e=="ok"){
							this.$message({
								message:"修改成功",
								type:"success"
							});
						}else{
							this.$message({
								message:"修改失败",
								type:"error"
							});
						}
						this.$router.push("/selectVisInfo");
					});
				}
			},
			mounted() {
				this.certypeDatas = [{
					cerid: 1,
					cername: "身份证"
				}, {
					cerid: 2,
					cername: "驾照"
				}, {
					cerid: 3,
					cername: "军人证"
				}, {
					cerid: 4,
					cername: "户口本"
				}, {
					cerid: 5,
					cername: "其它"
				}]
				fetch("/api/visitors/selectByVid?vid="+this.$route.query.vid).then(function(e){
					return e.json();
				}).then((e)=>{
					if(e.message=="err"){
						this.$router.push("/selectVisInfo");
					}else{
						var obj=e[0];
						this.form.visname=obj.visname;
						this.form.cernum=obj.cernum;
						this.form.certype=obj.certype;
						this.form.vistime=obj.vistime;
						this.form.leatime=obj.leatime;
						this.form.because=obj.because;
					}
				});
			}
	}
</script>

<style scoped="scoped">

</style>