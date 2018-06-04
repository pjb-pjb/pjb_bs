<template>
	<div class="root"> 
		<!--<div style="color: #000;font-size: 40px;font-weight: bold;position: fixed;bottom: 0;top: 0;margin-bottom: auto;margin-top: auto;height: 50px;line-height: 50px;text-align: center;margin-left: 150px;letter-spacing: 5px;text-shadow: 2px 2px 8px rgba(0,0,0,0.5);">
			<span>幸福养老院</span><br />
			<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管理系统</span>
		</div>-->
		<div class="loginbox">
			<div style="text-align: center;color: red;">{{message}}</div>
			<el-form :model="form" ref="formName" :label-position="labelPosition" label-width="80px" :rules="rules">
				<el-form-item label="用户名" prop="uname">
					<el-input v-model="form.uname" @change="change"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="upass">
					<el-input v-model="form.upass" type="password" @change="change"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code" style="width: 500px;">
					<el-input v-model="form.code" style="display: none;"></el-input>
					<div style="width: 217px;">
						<vue-input-code span-size="20px" type="text" :number="4" height="44px" span-color="#f35252" input-color="#3498db" input-size="24px" :code="code" :getinput="getinput" :success="success"></vue-input-code>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="login">登陆</el-button>
					<identify :identifyCode="identifyCode" style="cursor: pointer;float: right;" @click="click"></identify>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import identify from './identify.vue'
	import VueInputCode  from 'vue-input-code'
	export default {
		components: {
			identify,
			VueInputCode 
		},
		name: "login",
		data() {
			var a = (rule, value, callback) => {
				if(value!=this.identifyCode){
					callback(new Error('验证码输入有误'));
				}else{
					callback();
				}
			};
			return {
				labelPosition: 'left',
				message: "",
				rules: {
					uname: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, ],
					upass: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ],
					code:[{
						required: true,
						message: '请填写完善验证码',
						trigger: 'blur'
					},{
						validator: a, 
						trigger: 'blur' 
					}]
				},
				form: {
					upass: "",
					uname: "",
					code:""
				},
				identifyCodes: "1234567890abcdefg",
				identifyCode: "",
				code:[]
			};
		},
		methods: {
			change(){
				this.message="";
			},
			success(){
				this.form.code=this.code.join("");
				this.$refs['formName'].validate((valid) => {
					if(this.form.code==this.identifyCode){
						
					}else{
						return false;
					}
				})
			},
			getinput(n){
			},
			login() {
				this.$refs['formName'].validate((valid) => {
					if(valid) {
						var params = "uname=" + this.form.uname + "&upass=" + this.form.upass;
						fetch("/api/login/check?" + params).then(function(e) {
							return e.json();
						}).then((e) => {
							this.identifyCode = "";
							this.makeCode(this.identifyCodes, 4);
							if(e.message == "ok") {
								var arr = ["&d-12ei1-n", "*&21291)()1", "&%$#?/<>", "(!0di21j102"];
								this.setCookie("login", "yes");
								this.setCookie("uname", e.uname);
								this.setCookie("wname", e.wname);
								this.setCookie("ustatus", arr[e.ustatus]);
								this.$router.push("/")
							} else {
								this.uname = "";
								this.upass = "";
								this.message = "账号或密码输入有误"
							}
						})
					} else {
						return false;
					}
				});
			},
			setCookie(key, val, time) {
				var val = escape(val);
				if(time) {
					let date = new Date();
					date.setTime(date.getTime() + time);
					let ex = date.toGMTString();
					document.cookie = key + "=" + val + "; expires=" + ex;
				} else {
					document.cookie = key + "=" + val;
				}
			},
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
				for(let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					];
				}
			},
			click(){
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			}
		},
		mounted() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		}
	}
</script>

<style scoped>
	.loginbox {
		padding: 30px;
		width: 300px;
		height: 240px;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto 500px;
		color: #fff;
		background: #fff;
		border-radius: 20px;
		box-shadow: 2px 2px 10px 10px rgba(0,0,0,0.2);
	}
	.root{
		width: 100%;
		height: 100%;
		background: url(../assets/background.jpg);
		background-size: 100% 100%;
	}
</style>