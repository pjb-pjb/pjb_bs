<template>
	<div class="root">
		<el-input v-model="height[index]" :placeholder="'第'+(parseInt(index))+'层房间数'" clearable v-for="(item,index) in height" :key="index"></el-input>
		<div>
			 <el-button type="primary" @click="tijiao">提交</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods:{
			tijiao(){
				var height=this.$store.state.height;
				if(!height){
					return;
				}
				var hnum=this.$store.state.hnum;
				var hname=this.$store.state.hname;
				var rid=this.$store.state.rid;
				var bedinfo="";
				for (let i in this.height) {
					var str="";
					if(this.height[i]){
						for(let j=0;j<this.height[i];j++){
							str=`${str}${i+((j+1)>10?(j+1):"0"+(j+1))}:0,`;
						}
						bedinfo+=i+"."+str.slice(0,-1)+"|";
					}
				}
				bedinfo=bedinfo.slice(0,-1);
				var params=`hnum=${hnum}&hname=${hname}&height=${height}&bedinfo=${bedinfo}&rid=${rid}`;
				fetch("/api/bed/addBed",{
					method:"post",
					body:params,
					headers:{
						"content-type":"application/x-www-form-urlencoded"
					}
				}).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						this.$emit("qk");
						this.$router.push("/selectHouse");
						this.$message({
							message:"添加成功",
							type:"success"
						});
					}else{
						this.$message({
							message:"添加失败",
							type:"err"
						});
					}
				});
			}
		},
		computed:{
			height(){
				var obj={}
				for(let i=0;i<this.$store.state.height;i++){
					obj[i+1]=0;
				}
				return obj;
			}
		}
	}
</script>

<style scoped="scoped"></style>