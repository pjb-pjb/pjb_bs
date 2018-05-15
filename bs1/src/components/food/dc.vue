<template>
	<div class="root">
		<div style="position: fixed;right: 20px;top:200px;z-index: 100;width: 80px;text-align: right;">
			<el-button style="font-size: 12px;padding:10px;" @click="fh">返回</el-button>
			<el-button type="success" style="font-size: 12px;padding:10px;" @click="sub">提交</el-button>
			<el-button type="info" style="font-size: 12px;padding:10px;margin: 0;margin-top: 5px;" @click="chakan">{{str}}</el-button>
		</div>
		<el-form :rules="rules" label-width="80px" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名" prop="oname">
				<el-select v-model="form.oname" placeholder="请选择" filterable @change="change">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in onameDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="编号" prop="oid">
				<el-select v-model="form.oid" placeholder="请选择" filterable @change="change1">
					<el-option :key="index" :label="item" :value="item" v-for="(item,index) in oidDatas"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="地址" prop="eaddress">
				<el-input v-model="form.eaddress" disabled></el-input>
			</el-form-item>
			<el-form-item label="疾病史" prop="disease">
				<el-input v-model="form.disease" style="width: 800px;" disabled></el-input>
			</el-form-item>
		</el-form>
		<el-radio v-model="form.cftime1" name="a" label="早餐" style="margin-left: 80px;">早餐</el-radio>
		<el-radio v-model="form.cftime1" name="a" label="午餐">午餐</el-radio>
		<el-radio v-model="form.cftime1" name="a" label="晚餐">晚餐</el-radio>
		<el-date-picker type="date" placeholder="请选择" v-model="form.cftime" style="width: 200px;margin-left: 20px;"></el-date-picker>
		<el-row style="margin-left: 80px;margin-top: 30px;">
			<el-col :span="6" v-for="(item,index) in foodDatas" :key="index" :offset="index > 0 ? 2 : 0" style="position: relative;">
				<el-card :body-style="{ padding: '0px' }" shadow="hover">
					<div style="padding: 14px;line-height: 30px;letter-spacing: 1px;" @click="xz(item)">
						<span style="font-size: 20px;color: #409EFF;margin-right: 10px;">{{item.fname}}</span>
						<span>{{item.ftype}}</span>
						<div v-if="item.taboo" class="fnote" @mouseenter="enter(item,`不适用患有<span style='color: red;'>${item.taboo}</span>人群`)" @mouseleave="leave(item)">不适用患有<span style="color: red;">{{item.taboo}}</span>人群</div>
						<div v-else style="height: 30px;"></div>
						<div class="fnote" v-if="item.fnote" @mouseenter="enter(item,item.fnote)" @mouseleave="leave(item)">{{item.fnote}}</div>
						<div v-else style="height: 30px;"></div>
						<div class="bottom clearfix" style="float: right;margin-right: 20px;">
							<el-checkbox name="xz" v-model="item.flag"></el-checkbox>
						</div>
					</div>
					<p style="position: absolute;right: -70px;top: 0;z-index: 100;background: ;width: 70px;" v-html="item.xs"></p>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		mounted() {
			fetch("/api/enter/selectAll").then(function(e) {
				return e.json();
			}).then((e) => {
				this.oidDatas = [];
				this.onameDatas = [];
				e.forEach((val) => {
					this.oidDatas.push(val.oid);
					this.onameDatas.push(val.oname);
				});
			});
			fetch("/api/dc/selFood").then(function(e) {
				return e.json();
			}).then((e) => {
				this.foodDatas = e;
				this.foodDatas1 = e;
			});
		},
		data() {
			return {
				str: "查看已选",
				onameDatas: [],
				oidDatas: [],
				form: {
					disease: "",
					oname: "",
					oid: "",
					cftime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
					cftime1: "",
					eaddress: ""
				},
				foodDatas: [],
				foodDatas1: [],
				rules: {
					oname: {
						required: true,
						message: "请选择",
						trigger: "blur"
					},
					oid: {
						required: true,
						message: "请选择",
						trigger: "blur"
					}
				}
			}
		},
		methods: {
			fh(){
				this.$router.go(-1);
			},
			enter(item, xs) {
				item.xs = xs;
				this.foodDatas = Object.assign([], this.foodDatas);
			},
			leave(item) {
				item.xs = "";
				this.foodDatas = Object.assign([], this.foodDatas);
			},
			sub() {
				if(this.form.oid == "") {
					this.$message({
						message: "请选择老人信息",
						type: "warning"
					});
					return;
				} else if(this.form.cftime == "" || this.form.cftime1 == "") {
					this.$message({
						message: "请选择就餐时间",
						type: "warning"
					});
					return;
				}
				var arr = [];
				this.foodDatas.forEach(function(val) {
					if(val.flag) {
						arr.push(val.fid);
					}
				});
				var params = `oid=${this.form.oid}&fids=${JSON.stringify(arr)}&cftime=${this.form.cftime}&cftime1=${this.form.cftime1}`;
				fetch("/api/dc/addSign?" + params).then(function(e) {
					return e.text();
				}).then((e) => {
					if(e == "ok") {
						this.$message({
							message: "点餐成功",
							type: "success"
						});
						fetch("/api/dc/selFood").then(function(e) {
							return e.json();
						}).then((e) => {
							this.foodDatas = e;
							this.foodDatas1 = e;
						});
					} else {
						this.$message({
							message: "点餐失败",
							type: "error"
						});
					}
				});
			},
			chakan() {
				if(this.str == "查看已选") {
					this.foodDatas = this.foodDatas.filter((val) => {
						return val.flag;
					});
					this.str = "查看全部";
				} else {
					this.foodDatas = this.foodDatas1;
					this.str = "查看已选";
				}
			},
			change(val) {
				this.onameDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oid = this.oidDatas[index];
						this.sel();
					}
				});
			},
			change1(val) {
				this.oidDatas.forEach((e, index) => {
					if(val == e) {
						this.form.oname = this.onameDatas[index];
						this.sel();
					}
				});
			},
			change2() {
				console.log(this.checkList);
			},
			xz(item) {
				item.flag = !item.flag;
				this.foodDatas = Object.assign([], this.foodDatas);
			},
			sel() {
				fetch("/api/dc/selOldInfo?oid=" + this.form.oid).then(function(e) {
					return e.json();
				}).then((e) => {
					for(let i in e[0]) {
						this.form[i] = e[0][i];
					}
				});
			}
		}
	}
</script>

<style>
	.fnote {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>