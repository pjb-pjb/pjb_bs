<template>
	<div class="root">
		<el-form>
			<el-form-item label="楼栋编号:" prop="hnum">
				<el-input v-model="form.hnum" type="text" @change="change"></el-input>
			</el-form-item>
			<el-form-item label="楼栋名称:" prop="hname">
				<el-input v-model="form.hname" type="text" @change="change"></el-input>
			</el-form-item>
			<el-form-item label="楼层高度:" prop="height">
				<el-input v-model="form.height" type="text" @change="change"></el-input>
			</el-form-item>
			<el-form-item label="房间类型:" prop="rid">
				<el-select v-model="form.rid" placeholder="请选择"  style="width: 100px;" @change="change">
					<el-option :label="item['r_type_name']" :value="item.rid" :key="index" v-for="(item,index) in roomDates"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div>
			<router-view @qk="qk"></router-view>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				form: {
					hnum: "",
					hname: "",
					height: "",
					rid:""
				},
				roomDates:[]
			}
		},
		methods: {
			change(){
				console.log(this.form.rid);
				if(this.form.hnum != "" && this.form.hname != "" && this.form.height != ""&&this.form.rid!="") {
					console.log(this.form.rid);
					this.$store.state.height=this.form.height;	
					this.$store.state.hnum=this.form.hnum;
					this.$store.state.hname=this.form.hname;
					this.$store.state.rid=this.form.rid;
					this.$router.push("/addBed1");
				}
			},
			qk(){
				this.$store.state.height=0;	
				this.$store.state.hnum="";
				this.$store.state.hname="";
				this.form.hnum="";
				this.form.hname="";
				this.form.height=""
				this.form.rid="";
				this.$store.state.rid="";
				this.$emit("gx");
			}
		},
		mounted(){
			fetch("/api/bed/selectRtype").then(function(e){
				return e.json();
			}).then((e)=>{
				if(e.message!="err"){
					this.roomDates=e;
				}
			});
		}
	}
</script>

<style scoped="scoped">
	.el-form {
		display: flex;
	}
	.el-form-item {
		display: flex;
		margin-left: 10px;
	}
</style>