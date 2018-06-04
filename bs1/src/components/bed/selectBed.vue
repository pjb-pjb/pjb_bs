<template>
	<div class="root">
		<el-select v-model="hnum" placeholder="请选择">
			<el-option :key="index" :label="val" :value="val" v-for="(item,val,index) of bedDatas"></el-option>
		</el-select>
		<span style="letter-spacing: 1px;font-size: 18px;font-weight: bold;">
			<span style="margin-left: 30px;">本栋共<span style="color: #409EFF;">{{bedAll[hnum][0]}}</span>床位</span>
			<span>,入驻<span style="color: #409EFF;">{{bedAll[hnum][1]}}</span>个老人</span>
		</span>
		<el-row>
			<div v-for="(item,index) in bedDatas[hnum]" style="box-sizing: border-box;border: 1px solid #000;justify-content: flex-start;display: flex;">
				<div style="display: flex;justify-content:center;align-items: center;border-right: 1px solid #000;font-size: 26px;width: 50px;text-align: center;">
					{{item[0]}}<br/>层
				</div>
				<div style="flex-grow: 1;padding: 10px;">
					<el-col :span="8" v-for="(item1,index) in item[1]" :key="index" style="position: relative;">
						<el-card shadow="hover" :body-style="{ padding: '0px' }" style="min-height: 150px;">
							<div @mouseleave="qx(hnum+item1[0])">
								<div style="font-size: 24px;padding: 5px 0;text-align: center;">
									<span>{{item1[0]}}({{item[2]}})</span>
								</div>
								<div style="display: flex;">
									<img @click="xq(hnum+item1[0])" src="../../assets/kc.png" class="image">
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
								<div :ref="hnum+item1[0]" :class="hnum+item1[0]" class="b" style="z-index: 1000px;position: absolute;left: 0;top: -35px;width: 130px;box-shadow: 0px 0px 10px 1px;" v-if="item1[2]">
									<el-col :span="24" v-for="(e,index) in item1[2]" :key="index">
										<el-card class="a" shadow="hover" :body-style="{ padding: '0px' }" style="min-height: 70px;background: #000;color: #FFFFFF;cursor: pointer;">
											<div>{{e.oid}}</div>
											<div>{{e.oname}}</div>
											<span>{{e.age}}</span>
											<span>{{e.osex}}</span>
										</el-card>
									</el-col>
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
				hnum: "",
				oldDatas: [],
				bedAll:[]
			};
		},
		computed: {
			bedDatas() {
				this.bedAll=[];
				var obj = {};
				this.hnum = this.$store.state.bedDatas.length > 0 ? this.$store.state.bedDatas[0].hnum : "";
				this.$store.state.bedDatas.forEach((val) => {
					if(!(val.hnum in this.oldDatas)) {
						this.oldDatas[val.hnum] = {};
					}
					if(!(val.hnum in this.bedAll)) {
						this.bedAll[val.hnum] = [];
					}
					this.bedAll[val.hnum][1]=0;
					obj[val.hnum] = [];
					val.bedinfo.split("|").forEach((val1) => {
						var arr = [];
						var arr1 = [];
						arr1 = val1.split(".");
						arr1[1].split(",").forEach((val2) => {
							var arr2 = val2.split(":");
							var Arr = this.oldDatas[val.hnum][arr2[0]];
							if(arr2[1] == val.bed_n) {
								arr.push([arr2[0], -1, Arr]);
							} else {
								arr.push([arr2[0], val.bed_n - arr2[1], Arr]);
							}
							this.bedAll[val.hnum][1]=this.bedAll[val.hnum][1]+arr2[1]*1;
						});
						this.bedAll[val.hnum][0]=this.bedAll[val.hnum][0]?this.bedAll[val.hnum][0]:0;
						this.bedAll[val.hnum][0]+=arr.length*val.bed_n;
						obj[val.hnum].push([arr1[0], arr, val.r_type_name]);
					});
				});
				return obj;
			}
		},
		mounted() {
			fetch("/api/enter/selAll").then(function(e) {
				return e.json();
			}).then((e) => {
				var obj = {};
				e.forEach((val) => {
					var str = val.eaddress;
					var age = Math.ceil((new Date().getTime() - new Date(val.obir).getTime()) / 1000 / 69 / 60 / 24 / 365);
					val.age = age;
					if(!(str.substr(0, 1) in obj)) {
						obj[str.substr(0, 1)] = {};
					}
					if(!(str.substr(1) in obj[str.substr(0, 1)])) {
						obj[str.substr(0, 1)][str.substr(1)] = [];
					}
					obj[str.substr(0, 1)][str.substr(1)].push(val);
				});
				this.oldDatas = obj;
			})
		},
		methods:{
			xq(item){
				if(this.$refs[item]){
					this.$refs[item][0].style.display="block";
				}
			},
			qx(item){
				if(this.$refs[item]){
					this.$refs[item][0].style.display="none";
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.yuan,
	.yuan1 {
		margin: 20px auto 0;
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
	}
	
	.yuan {
		background: red;
	}
	
	.yuan1 {
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
	.a{
		transition: all .3s;
	}
	.a:hover{
		color: #ADFF2F !important;
	}
	.b{
		display: none;
	}
</style>