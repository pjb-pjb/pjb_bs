<template>
	<div class="root">
		<el-form ref="form" :model="form" label-width="80px" :rules="rules" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="姓名">
				<el-input v-model="form.oname" style="width: 217px;" readonly></el-input>
			</el-form-item>
			<el-form-item label="签约时间">
				<el-input v-model="form.ctime" style="width: 217px;" readonly></el-input>
			</el-form-item>
			<el-form-item label="到期时间">
				<el-input v-model="form.endtime" style="width: 217px;" readonly></el-input>
			</el-form-item>
			<el-form-item label="退住原因">
				<el-select v-model="form.because" placeholder="请选择" @change="change">
					<el-option key="0" label="死亡" value="死亡"></el-option>
					<el-option key="1" label="病重" value="病重"></el-option>
					<el-option key="2" label="合同到期" value="合同到期"></el-option>
					<el-option key="3" label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否违约">
				<el-select v-model="form.isWy" placeholder="请选择" @change="change">
					<el-option key="0" label="是" value="0"></el-option>
					<el-option key="1" label="否" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item style="width: 500px;">
				<div style="font-size: 20px;">
					<span v-if="price<0&&flag">需交费<span style="color: red;">{{Math.abs(price)}}</span>元
					</span>
					<span v-if="price>=0&&flag">剩余<span style="color: red;">{{price}}</span>元</span>
				</div>
				<el-button @click="tz" v-if="flag">提交</el-button>
				<el-button @click="fh">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				price1:0,
				price: 0,
				now: "",
				form: {
					oname: "",
					oid: "",
					ctime: "",
					endtime: "",
					because: "",
					isWy: "",
					yjf: "",
					r_price: "",
					shprice: "",
					nprice: "",
					eaddress:""
				},
				rules: {},
				flag: false,
				hours:""
			}
		},
		mounted() {
			this.now = new Date();
			fetch("/api/retreat/selByOid?oid=" + this.$route.params.oid).then(function(e) {
				return e.json();
			}).then((e) => {
				if(e.message != "err") {
					for(let i in this.form) {
						this.form[i] = e[0][i];
					}
				}
			});
		},
		methods: {
			tz() {
				var hoursInfo=this.form.eaddress.substring(0,1);
				var roomInfo=this.form.eaddress.substring(1);
				var n=this.hours.indexOf(roomInfo);
				var n1=this.hours.substr(n+4,1)-1;
				var bedinfo=this.hours.slice(0,n+4)+n1+this.hours.slice(n+5);
				if(this.price>0){
					var str=`需退${this.price}元`;
				}else{
					var str=`需缴${Math.abs(this.price)}元`;
				}
				this.$confirm(str, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					fetch(`/api/retreat/tz?oid=${this.$route.params.oid}&price=${this.price}&price1=${this.price1}&bedinfo=${bedinfo}&hnum=${hoursInfo}&tz_because=${this.form.because}`, {
							credentials: 'include'
						}).then(function(e){
						return e.text();
					}).then((e)=>{
						if(e=="ok"){
							this.$message({
								type: 'success',
								message: this.form.oname+'退住成功!'
							});
							this.$router.go(-1);
						}else{
							this.$message({
								type: 'error',
								message: '退住失败'
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			fh() {
				this.$router.go(-1);
			},
			change() {
				if(this.form.because && this.form.isWy) {
					var price = 0;
					var price1 = 0;
					if(this.form.endtime == "") {
						if(this.form.isWy == 1) {
							price = this.form.yjf;
						} else {
							price = this.form.yjf - 5000;
							price1 = 5000;
						}
					} else {
						var n = new Date(this.time(this.now).split(" ")[0]).getTime() - new Date(this.form.endtime).getTime();
						if(n < 0) {
							if(this.form.isWy == 1) {
								price = this.form.yjf;
							} else {
								price1 = Math.floor(Math.abs((n / 1000 / 60 / 60 / 24 / 30)) - 1) * 200;
								price = this.form.yjf - price1;
							}
						} else {
							console.log(n / 1000 / 60 / 60 / 24);
							price1 = Math.ceil(Math.ceil((n / 1000 / 60 / 60 / 24)) * (this.form.r_price + this.form.shprice + this.form.nprice) / 30);
							price = this.form.yjf - price1;
						}
					}
					this.price = price;
					this.price1 = price1;
					this.flag = true;
				}
				fetch("/api/retreat/selRoom?hnum="+this.form.eaddress.substring(0,1)).then(function(e){
					return e.text();
				}).then((e)=>{
					this.hours=e;
				});
			},
			time(time) {
				var year = time.getFullYear() >= 10 ? time.getFullYear() : "0" + time.getFullYear();
				var mon = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
				var day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
				var hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours();
				var min = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes();
				var sec = time.getSeconds() >= 10 ? time.getSeconds() : "0" + time.getSeconds();
				return year + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + sec;
			}
		}
	}
</script>

<style>

</style>