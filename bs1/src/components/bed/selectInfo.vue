<template>
	<div class="root">
		<div v-if="flag">
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column prop="hnum" label="楼房编号" width="300">
				</el-table-column>
				<el-table-column prop="hname" label="楼房名称" width="300">
				</el-table-column>
				<el-table-column prop="r_type_name" label="房间类型" width="200">
				</el-table-column>
				<el-table-column label="操作" width="275">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="del(scope.row.hid)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div v-if="!flag">
			<el-form>
				<el-form-item label="楼栋名称:" prop="hnum">
					<el-input v-model="hname" type="text"></el-input>
				</el-form-item>
				<el-form-item label="楼栋高度:" prop="height">
					<el-input v-model="height" type="text" disabled></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="rid" placeholder="请选择" style="width: 200px;">
						<el-option :label="item['r_type_name']" :value="item.rid" :key="index" v-for="(item,index) in roomDates"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<div v-for="(item,index) in height">
						<span>{{'第'+item+'层'}}</span>
						<el-input type="number" v-model="item.roomNum" :value="item.roomNum" v-for="(item,index1) in bedDatas[index]" :key="index1">
							<i slot="suffix" class="el-input__icon el-icon-close" @click="delRoom(index,index1)" style="cursor: pointer;"></i>
							<i slot="suffix" class="el-input__icon el-icon-plus" @click="addRoom(index,index1)" style="cursor: pointer;"></i>
						</el-input>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click="quxiao">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["tableData"],
		data() {
			return {
				flag: true,
				roomDates: [],
				rid: "",
				bedDatas: [],
				hname: "",
				height:"",
				hnum:""
			}
		},
		methods: {
			addRoom(n,n1) {
				this.bedDatas[n].splice(n1 + 1, 0, {
					roomNum: "",
					n:0
				});
				this.bedDatas = Object.assign([], this.bedDatas)
			},
			delRoom(n,n1) {
				this.bedDatas[n] = this.bedDatas[n].filter((val, index) => {
					return index != n1;
				});
				this.bedDatas = Object.assign([], this.bedDatas)
			},
			onSubmit() {
				let hname = this.hname,
					rid = this.rid,
					bedinfo = "";
					var str="";
					console.log(this.bedDatas);
					this.bedDatas.forEach((val,index) => {
					var str1="";
					val.forEach((val1,index)=>{
						if(val1.roomNum){
							str1+=val1.roomNum+":"+val1.n+","
						}
					});
					str+=str1?(index+1)+"."+str1.slice(0,-1)+"|":"";
				});
				bedinfo=str.slice(0,-1);
				console.log(bedinfo);
				fetch("/api/bed/edit",{
					method:"post",
					headers:{
						"content-type":"application/x-www-form-urlencoded"
					},
					body:`hname=${hname}&rid=${rid}&bedinfo=${bedinfo}&hnum=${this.hnum}`
				}).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						this.flag=true;
						this.$emit("gx");
						this.$message({
							message:"编辑成功",
							type:"success"
						});
					}else{
						this.$message({
							message:"编辑失败",
							type:"error"
						});
					}
				});
			},
			quxiao() {
				this.flag = true;
				this.roomDates = [];
				this.rid = '';
				this.bedDatas = [];
				this.hname = "";
			},
			edit(item) {
				this.hname = item.hname;
				this.rid = item.rid;
				this.height = item.height;
				this.hnum = item.hnum;
				this.flag = false;
				var arr = item.bedinfo.split("|");
				var obj2 = {};
				var arr3=[];
				arr.forEach((val1) => {
					var arr2 = [];
					arr3 = val1.split(".")
					var arr1=arr3[1].split(",");
					arr1.forEach((val2) => {
						arr2.push({
							roomNum: val2.split(":")[0],
							n: val2.split(":")[1]
						});
					});
					this.bedDatas[arr3[0]-1] = arr2;
				});
				for(let i=0;i<this.height;i++){
					if(!(i in this.bedDatas)){
						this.bedDatas[i]=[{
							roomNum: "",
							n: 0
						}];
					}
				}
			},
			del(hid) {
				fetch("/api/bed/del/"+hid).then(function(e){
					return e.text();
				}).then((e)=>{
					if(e=="ok"){
						this.$message({
							message:"删除成功",
							type:"success"
						});
						this.$emit("gx");
					}else{
						this.$message({
							message:"删除失败",
							type:"error"
						});
					}
				});
			}
		},
		mounted() {
			fetch("/api/bed/selectRtype").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					this.roomDates = e;
				}
			});
		}
	}
</script>

<style scoped="scoped">
	.el-table-column {
		text-align: center;
	}
</style>