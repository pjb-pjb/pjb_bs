<template>
	<div class="root">
		<div class="dbsx">
			<div style="height: 25px;padding: 2px;display: flex;align-items: center;margin-bottom: 10px;">
				<img src="../assets/xjt1.png" style="width: 18px;height: 18px;margin-right: 5px;"/>
				<span style="font-size: 20px;font-weight: bold;color: #188661;">待办事项</span>
			</div>
			<ul style="overflow: hidden;">
				<li style="margin-left: 10px;">
					<router-link tag="div" to="/enterInfo">
						<p style="color: #e2524a;">{{db}}</p>
						<p>入驻待办理</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/costInfo?flag=qf">
						<p style="color: #e2524a;">{{qf}}</p>
						<p>欠费名单</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/selectGoods">
						<p style="color: #e2524a;">{{kc}}</p>
						<p>库存预警</p>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="cycd" style="margin-top: 20px;">
			<div style="height: 25px;padding: 2px;display: flex;align-items: center;margin-bottom: 10px;">
				<img src="../assets/xjt2.png" style="width: 18px;height: 18px;margin-right: 5px;"/>
				<span style="font-size: 20px;font-weight: bold;color: #188661;">常用菜单</span>
			</div>
			<ul style="overflow: hidden;background: #e3f1fa;border: 1px solid #f2f2f2;padding: 20px;">
				<li>
					<router-link tag="div" to="/enterInfo">
						<img src="../assets/lrgl.png"/>
						<p>老人信息</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/yzInfo">
						<img src="../assets/yhgl.png"/>
						<p>医护管理</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/selectGoods">
						<img src="../assets/wpgl.png"/>
						<p>库存信息</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/selectVisInfo">
						<img src="../assets/tslf.png"/>
						<p>来访管理</p>
					</router-link>
				</li>
				<li>
					<router-link tag="div" to="/enterInfo?flag=1">
						<img src="../assets/rzdj.png"/>
						<p>入驻登记</p>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				db:0,
				qf:0,
				kc:0
			}
		},
		methods: {

		},
		mounted(){
			fetch("/api/sys/selDbsx").then(function(e){
				return e.json();
			}).then((e)=>{
				for(let i in e){
					this[i]=e[i];
				}
			});
		}
	}
</script>

<style scoped="scoped">
	.dbsx li{
		width: 190px;
		height: 50px;
		background: #f9fbfc;
		float: left;
		margin-right: 30px;
		color: #000;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 7px 0;
		cursor: pointer;
		border-radius: 3px;
	}
	.dbsx li:hover{
		background: #feeed2;
	}
	.cycd li:hover{
		cursor: pointer;
		margin-top: 0px;
		color: #188661;
	}
	.cycd li{
		float: left;
		margin-right: 70px;
		margin-top: 5px;
		transition: all 0.5s;
	}
</style>