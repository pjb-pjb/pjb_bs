<template>
	<div class="root">
		<div v-if="flag">
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column  prop="hnum" label="楼房编号" width="300">
				</el-table-column>
				<el-table-column  prop="hname" label="楼房名称" width="300">
				</el-table-column>
				<el-table-column  prop="r_type_name" label="房间类型" width="200">
				</el-table-column>
				<el-table-column label="操作" width="275">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div v-if="!flag">
			<el-form>
				<el-form-item label="楼栋名称:" prop="hnum">
					<el-input v-model="hname" type="text"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="rid" placeholder="请选择"  style="width: 200px;">
						<el-option :label="item['r_type_name']" :value="item.rid" :key="index" v-for="(item,index) in roomDates"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
						<el-input v-model="item.roomNum" :value="item.roomNum" v-for="(item,index) in bedDatas" :key="index">
							<i slot="suffix" class="el-input__icon el-icon-close" @click="delRoom(index)" style="cursor: pointer;"></i>
							<i slot="suffix" class="el-input__icon el-icon-plus" @click="addRoom(index)" style="cursor: pointer;"></i>
						</el-input>
						<el-button @click="add">添加房间</el-button>
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
		props:["tableData"],
		data() {
			return {
				flag:true,
				roomDates:[],
				rid:"",
				bedDatas:[],
				hname:""
			}
		},
		methods: {
			addRoom(n){
				this.bedDatas.splice(n+1,0,{roomNum:""});
			},
			delRoom(n){
				console.log(1)
				this.bedDatas=this.bedDatas.filter((val,index)=>{
					return index!=n;
				});
			},
			add(){
				this.bedDatas.push({roomNum:""});
			},
			onSubmit(){
				console.log(this.bedDatas);
			},
			quxiao(){
				this.flag=true;
				this.roomDates=[];
				this.rid='';
				this.bedDatas=[];
				this.hname="";
			},
			edit(item) {
				this.hname = item.hname;
				this.rid = item.rid;
				this.flag=false;
				var arr=item.bedinfo.split("|");
				var obj2={};
				var arr2=[];
				arr.forEach((val1)=>{
					var arr1=val1.split(".")[1].split(",");
					arr1.forEach((val2)=>{
						arr2.push({roomNum:val2.split(":")[0]});
					});
				});
				this.bedDatas=arr2;
			},
			del(item) {

			}
		},
		mounted() {
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
	.el-table-column{
		text-align: center;
	}
</style>