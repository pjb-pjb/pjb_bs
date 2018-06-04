<template>
	<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
		<el-tab-pane :label="item.name" :name="n.toString()" v-for="(item,n) in testDatas" :key="n">
			<div style="padding-bottom: 20px;margin-left: 10px;" v-for="(item1,index) in item.datas">
				<p style="margin-bottom: 10px;"><span>{{index+1}}.</span>{{item1[0]}}</p>
				<div style="margin-left: 20px;">
					<el-radio :key="key" v-model="item1[3]" :label="item1[1][key]" v-for="(item2,key) in item1[2]" :name="index.toString()" @change="change(item1[1][key],index,item.name)">{{item2}}</el-radio>
				</div>
			</div>
		</el-tab-pane>
		<slot></slot>
	</el-tabs>
</template>
<script>
	export default {
		data() {
			return {
				activeName2: 0,
				testDatas: []
			};
		},
		methods: {
			handleClick(tab, event) {},
			change(score, index, type) {
				this.testDatas = Object.assign([], this.testDatas)
				this.$store.state.isAll = true;
				if(typeof this[type]=="undefined"){
					this[type]={};
				}
				this[type][index]=score;
				this.$store.state.score = 0;
				this.testDatas.forEach((val,index)=>{
					val.datas.forEach((val1)=>{
						if(val1[3]==""){
							this.$store.state.isAll = false;
						}else{
							this.$store.state.score = parseFloat(this.$store.state.score) + parseInt(val1[3])/this.testDatas.length;
						}
					});
				});
			}
		},
		mounted() {
			if(this.$store.state.oid == "") {
				this.$router.push("/enterPg");
				return;
			}
			fetch("/api/pg/selTest").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					var arr=[];
					arr.name=val.ptname;
					var arr1=val.pttitle.split("|");
					var arr2=val.result.split("|");
					var arr3=[];
					arr1.forEach((val1,index)=>{
						arr3.push([val1.split(":")[0],val1.split(":")[1].split(","),arr2[index].split(","),""]);
					});
					arr.datas=arr3;
					this.testDatas.push(arr);
				});
				console.log(this.testDatas);
			});
		}
	};
</script>
