<template>
	<div class="root">
		<el-select v-model="hnum" placeholder="请选择">
			<el-option :key="index" :label="val" :value="val" v-for="(item,val,index) of bedDatas"></el-option>
		</el-select>
		<el-row>
			<div v-for="(item,index) in bedDatas[hnum]" style="box-sizing: border-box;border: 1px solid #000;justify-content: flex-start;overflow: hidden;display: flex;">
				<div style="display: flex;justify-content:center;align-items: center;border-right: 1px solid #000;font-size: 26px;width: 50px;text-align: center;">
					{{item[0]}}<br/>层
				</div>
				<div style="flex-grow: 1;padding: 10px;">
					<el-col :span="8" v-for="(item1,index) in item[1]" :key="index">
						<el-card shadow="hover" :body-style="{ padding: '0px' }" style="min-height: 150px;">
							<div style="">
								<div style="font-size: 24px;padding: 5px 0;text-align: center;">
									<span>{{item1[0]}}({{item[2]}})</span>
								</div>
								<div style="display: flex;">
									<img src="../../assets/kc.png" class="image">
									<div style="flex-grow: 1;text-align: center;">
										<div v-if="item1[1]==-1">
											<span class="yuan"></span>
											<div>已满</div>
										</div>
										<div v-else>
											<span class="yuan1"></span>
											<div>空余{{item1[1]}}张床</div>
										</div>
									</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</div>
			</div>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				hnum:""
			};
		},
		computed: {
			bedDatas() {
				var obj={};
				this.hnum=this.$store.state.bedDatas.length>0?this.$store.state.bedDatas[0].hnum:"";
				this.$store.state.bedDatas.forEach((val)=>{
					obj[val.hnum]=[];
					val.bedinfo.split("|").forEach((val1)=>{
						var arr=[];
						var arr1=[];
						arr1=val1.split(".");
						arr1[1].split(",").forEach((val2)=>{
							var arr2=val2.split(":");
							if(arr2[1]==val.rid){
								arr.push([arr2[0],-1]);
							}else{
								arr.push([arr2[0],val.rid-arr2[1]]);
							}
						});
						obj[val.hnum].push([arr1[0],arr,val.r_type_name]);
					});
				});
				return obj;
			}
		}
	}
</script>

<style scoped="scoped">
	.yuan,.yuan1{
		margin: 20px auto 0;
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
	}
	.yuan{
		background: red;
	}
	.yuan1{
		background: greenyellow;
	}
	.time {
		font-size: 13px;
		color: #999;
	}
	
	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}
	
	.button {
		padding: 0;
		float: right;
	}
	
	.image {
		width: 100px;
		height: 80px;
		display: block;
	}
	
	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}
	
	.clearfix:after {
		clear: both;
	}
</style>