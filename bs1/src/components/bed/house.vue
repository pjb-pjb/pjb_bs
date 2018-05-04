<template>
	<div class="root">
		<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
			<el-tab-pane label="床位展示" name="first">
				<selectBed></selectBed>
			</el-tab-pane>
			<el-tab-pane label="详细信息" name="second">
				<selectInfo :tableData="tableData"></selectInfo>
			</el-tab-pane>
			<el-tab-pane label="床位设计" name="three">
				<addBed @gx="gx"></addBed>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import addBed from "@/components/bed/addBed.vue"
	import selectInfo from "@/components/bed/selectInfo.vue"
	import selectBed from "@/components/bed/selectBed.vue"
	export default {
		data() {
			return {
				activeName2: "",
				tableData: []
			};
		},
		methods: {
			handleClick(a) {},
			gx() {
				fetch("api/bed/select").then(function(e) {
					return e.json();
				}).then((e) => {
					if(e.message != "err") {
						this.tableData = e;
						this.$store.state.bedDatas = e;
					}
				});
			}
		},
		mounted() {
			fetch("api/bed/select").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.tableData = e;
					this.$store.state.bedDatas = e;
				}
			});
		},
		components: {
			addBed,
			selectInfo,
			selectBed
		}
	}
</script>

<style scoped="scoped">

</style>