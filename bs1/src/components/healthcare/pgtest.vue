<template>
	<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
		<el-tab-pane label="自我照顾能力评分" name="first">
			<div style="padding-bottom: 20px;margin-left: 10px;" v-for="(item,index) in testDatas">
				<p style="margin-bottom: 10px;"><span>{{index+1}}、</span>{{item.title}}</p>
				<div style="margin-left: 20px;">
					<el-radio :key="key" v-model="item.df" :label="item.score[key].toString()" v-for="(item1,key) in result" :name="index.toString()" @change="change(item.score[key],index,0)">{{item1}}</el-radio>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="MORSE 评估" name="second">
			<div style="padding-bottom: 20px;margin-left: 10px;" v-for="(item,index) in testDatas1">
				<p style="margin-bottom: 10px;"><span>{{index+1}}、</span>{{item.title}}</p>
				<div style="margin-left: 20px;">
					<el-radio :key="key" v-model="item.df" :label="item.score[key].toString()" v-for="(item1,key) in result1[index]" @change="change(item.score[key],index,1)" :name="index.toString()">{{item1}}</el-radio>
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
				activeName2: 'first',
	testDatas: [],
	testDatas1: [],
	result: [],
	result1: [],
	optionArr1: [],
	optionArr2: [],
	a: true
};
},
methods: {
		handleClick(tab, event) {},
		change(score, index, type) {
			this.$store.state.isAll=true;
			if(type == 0) {
				this.optionArr1[index] = score;
			} else if(type == 1) {
				this.optionArr2[index] = score;
			}
			this.$store.state.score = 0;
			for(let i=0;i<this.testDatas.length;i++){
				var val=this.optionArr1[i];
				if(typeof val=="undefined"){
					this.$store.state.isAll=false;
					continue;
				}
				this.$store.state.score = parseInt(this.$store.state.score) + parseInt(val);
			}
			for(let i=0;i<this.testDatas1.length;i++){
				var val=this.optionArr2[i];
				if(typeof val=="undefined"){
					this.$store.state.isAll=false;
					continue;
				}
				this.$store.state.score = parseInt(this.$store.state.score) + parseInt(val);
			}
		}
	},
	mounted() {
		if(this.$store.state.oid =="") {
				this.$router.push("/enterPg");
				return;
			}
			fetch("/api/pg/selTest").then(function(e) {
				return e.json();
			}).then((e) => {
				e.forEach((val) => {
					if(val.pttype == "0") {
						this.result = val.result.split("|");
					}
					if(val.pttype == "1") {
						var arr2 = val.result.split("|");
						arr2.forEach((val1) => {
							this.result1.push(val1.split(","));
						});
					}
					var arr = val.pttitle.split("|");
					arr.forEach((val1) => {
						var arr1 = val1.split(":");
						var obj = {
							title: arr1[0],
							score: arr1[1].split(","),
							df: ""
						};
						if(val.pttype == "0") {
							this.testDatas.push(obj);
						}
						if(val.pttype == "1") {
							this.testDatas1.push(obj);
						}
					});
				});
			});
		}
	};
</script>