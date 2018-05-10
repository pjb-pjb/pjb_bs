<template>
	<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
		<el-tab-pane label="入驻信息" name="first">
			<sel v-if="flag=='sel'" @edit="edit"  :onameDatas="onameDatas" :oidDatas="oidDatas"></sel>
			<edit v-else @edit="edit"></edit>
		</el-tab-pane>
		<el-tab-pane label="添加信息" name="second">
			<add @tz="tz"></add>
		</el-tab-pane>
	</el-tabs>
</template>
<script>
	import add from "./add.vue"
	import edit from "./edit.vue"
	import sel from "./sel.vue"
	export default {
		data() {
			return {
				activeName2: 'first',
				flag: "sel",
				oidDatas:[],
				onameDatas:[]
			};
		},
		methods: {
			edit(str) {
				this.flag = str;
			},
			handleClick(tab, event) {},
			tz() {
				this.sel();
				this.activeName2 = "first";
			},
			sel() {
				fetch("/api/enter/selectAll").then(function(e) {
					return e.json();
				}).then((e) => {
					this.oidDatas=[];
					this.onameDatas=[];
					e.forEach((val) => {
						this.oidDatas.push(val.oid);
						this.onameDatas.push(val.oname);
					});
				});
			}
		},
		components: {
			add,
			edit,
			sel
		},
		mounted() {
			this.sel();
		}
	};
</script>
<style scoped="scoped">

</style>