<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules">
			<el-form-item label="姓名" prop="wnum">
				<el-select v-model="form.wnum" filterable placeholder="请选择" filterable>
					<el-option v-for="item in workerDatas" :key="item.wnum" :label="item.wname" :value="item.wnum">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="部门" prop="bnum">
				<el-select v-model="form.bnum" filterable placeholder="请选择" filterable>
					<el-option v-for="item in braDatas" :key="item.bnum" :label="item.bname" :value="item.bnum">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="物品名称" prop="gnum">
				<el-select v-model="form.gnum" filterable placeholder="请选择" filterable>
					<el-option v-for="item in goodsDatas" :key="item.gnum" :label="item.gname" :value="item.gnum">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="数量" prop="oamount">
				<el-input v-model="form.oamount" type="number" style="width:217px"></el-input>
			</el-form-item>
			<el-form-item label="出库原因" prop="obecause">
				<el-select v-model="form.obecause" filterable placeholder="请选择" filterable>
					<el-option v-for="(item,index) in obecaDatas" :key="index" :label="item.name" :value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间" prop="otime">
				<div class="block">
					<el-date-picker v-model="form.otime" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">提交</el-button>
				<el-button @click="quxiao">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			var checkOamount = (rule, value, callback) => {
				if(value <= 0) {
					return callback(new Error("数量必须大于0"));
				} else {
					callback();
				}
			}
			var checkOamount1 = (rule, value, callback) => {
				if(this.form.gnum == "") {
					this.form.oamount = "";
					return callback(new Error("请选择物品"));
				} else {
					for(let i = 0; i < this.goodsDatas.length; i++) {
						if(this.form.gnum == this.goodsDatas[i].gnum) {
							if(this.form.oamount > this.goodsDatas[i].gamount) {
								return callback(new Error("库存不足"));
							} else {
								callback();
							}
						}
					}
				}
			}
			return {
				form: {
					wnum: "",
					bnum: "",
					oamount: "",
					gnum: "",
					otime: "",
					obecause: ""
				},
				braDatas: [],
				workerDatas: [],
				goodsDatas: [],
				obecaDatas: [{
					name: "领取"
				}, {
					name: "损坏"
				}],
				rules: {
					oamount: [{
							validator: checkOamount1,
							trigger: "blur"
						}, {
							required: true,
							message: "请输入数量",
							trigger: "blur"
						},
						{
							validator: checkOamount,
							trigger: 'blur'
						}
					],
					wnum: [{
						required: true,
						message: "请选择姓名",
						trigger: "change"
					}],
					bnum: [{
						required: true,
						message: "请选择部门",
						trigger: "change"
					}],
					gnum: [{
						required: true,
						message: "请选择物品",
						trigger: "change"
					}],
					obecause: [{
						required: true,
						message: "请选择出库原因",
						trigger: "change"
					}],
					otime: [{
						required: true,
						message: "请选择时间",
						trigger: "change"
					}]

				}
			}
		},
		methods: {
			quxiao() {
				this.$router.push("/selectGoods");
			},
			onSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var gamount = 0;
						for(let i = 0; i < this.goodsDatas.length; i++) {
							if(this.form.gnum == this.goodsDatas[i].gnum) {
								gamount = this.goodsDatas[i].gamount - this.form.oamount;
								break;
							}
						}
						var params = `wnum=${this.form.wnum}&bnum=${this.form.bnum}&oamount=${this.form.oamount}&gnum=${this.form.gnum}&otime=${this.form.otime}&obecause=${this.form.obecause}&gamount=${gamount}`;
						fetch("/api/ogoods/addSign?" + params, {
							credentials: 'include'
						}).then(function(e) {
							return e.text()
						}).then(function(e) {
							if(e == "ok") {
								this.$message({
									message: "出库成功",
									type: "success"
								});
							} else {
								this.$message({
									message: "出库失败",
									type: "error"
								});
							}
						}.bind(this));
					} else {
						return false;
					}
				});
			}
		},
		mounted() {
			fetch("/api/ogoods/selectInfo").then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message == "err") {
					//					this.$router.push("/select");
				} else {
					this.braDatas = e.braDatas;
					this.workerDatas = e.workerDatas;
					this.goodsDatas = e.goodsDatas;
				}
			});
		}
	}
</script>

<style scoped="scoped">

</style>