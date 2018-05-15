<template>
	<div class="root">
		<el-container>
			<el-header style="padding: 0;">
				<div style="box-sizing: border-box;width: 100%;height: 100%;background: #32329c;display: flex;justify-content: space-between;align-items: center;padding: 0 20px;">
					<div>
						<span style="color: #fff;font-size: 24px;font-weight: bold;">幸福养老院管理系统</span><span style="color: #fff;margin-left: 20px;">欢迎{{wname}}</span>
					</div>
					<div class="a">
						<span style="color: #fff;margin-right: 10px;" @click="sy">首页</span>
						<span style="color: #fff;" @click="tc">退出</span>
					</div>
				</div>
			</el-header>
			<el-container>
				<el-aside width="220px" style="overflow: scroll;">
					<el-row class="tac">
						<el-col :span="24">
							<el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" unique-opened v-if="ustatus==3||ustatus==0">
								<el-submenu index="1">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>来访人员信息管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/addVisInfo">
											<el-menu-item index="1-1">添加信息</el-menu-item>
										</router-link>
										<router-link to="/selectVisInfo">
											<el-menu-item index="1-2">查看信息</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"  v-if="ustatus==2||ustatus==0">
								<el-submenu index="2">
									<template slot="title">
										<i class="el-icon-tickets"></i>
										<span>物品管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/addGoodsSign">
											<el-menu-item index="2-1">物品入库</el-menu-item>
										</router-link>
										<router-link to="/selectGoods">
											<el-menu-item index="2-2">库存查询</el-menu-item>
										</router-link>
										<router-link to="/outGoods">
											<el-menu-item index="2-3">出库登记</el-menu-item>
										</router-link>
										<router-link to="/outInfo">
											<el-menu-item index="2-4">出库记录</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-if="ustatus==0">
								<el-submenu index="3">
									<template slot="title">
										<i class="el-icon-star-on"></i>
										<span>员工管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/selectWorker">
											<el-menu-item index="3-1">员工信息</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-if="ustatus==1||ustatus==0">
								<el-submenu index="4">
									<template slot="title">
										<i class="el-icon-setting"></i>
										<span>床位管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/selectHouse">
											<el-menu-item index="4-1">查看信息</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" unique-opened v-if="ustatus==2||ustatus==0">
								<el-submenu index="5">
									<template slot="title">
										<i class="el-icon-menu"></i>
										<span>后勤管理</span>
									</template>
									<el-submenu index="5-1">
										<template slot="title">工程维修</template>
										<router-link to="/selectService">
											<el-menu-item index="5-1-1">维修信息</el-menu-item>
										</router-link>
									</el-submenu>
									<el-submenu index="5-2">
										<template slot="title">膳食管理</template>
										<router-link to="/selFood">
											<el-menu-item index="5-2-1">食物管理</el-menu-item>
										</router-link>
										<router-link to="/dcInfo">
											<el-menu-item index="5-2-2">点餐管理</el-menu-item>
										</router-link>
										<router-link to="/scInfo">
											<el-menu-item index="5-2-3">送餐记录</el-menu-item>
										</router-link>
									</el-submenu>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-if="ustatus==1||ustatus==0">
								<el-submenu index="6">
									<template slot="title">
										<i class="el-icon-document"></i>
										<span>老人管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/enterInfo">
											<el-menu-item index="6-1">入驻登记</el-menu-item>
										</router-link>
										<router-link to="/formal">
											<el-menu-item index="6-2">正式签约</el-menu-item>
										</router-link>
										<router-link to="/costInfo">
											<el-menu-item index="6-3">费用查询</el-menu-item>
										</router-link>
										<router-link to="/oldout">
											<el-menu-item index="6-4">外出登记</el-menu-item>
										</router-link>
										<router-link to="/retreat">
											<el-menu-item index="6-5">退住结算</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-if="ustatus==1||ustatus==0">
								<el-submenu index="7">
									<template slot="title">
										<i class="el-icon-mobile-phone"></i>
										<span>医护工作站</span>
									</template>
									<el-menu-item-group>
										<router-link to="/enterPg">
											<el-menu-item index="7-1">入驻评估</el-menu-item>
										</router-link>
										<router-link to="/yzInfo">
											<el-menu-item index="7-2">医嘱查询</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" v-if="ustatus==0">
								<el-submenu index="8">
									<template slot="title">
										<i class="el-icon-caret-right"></i>
										<span>系统管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/branchInfo">
											<el-menu-item index="8-1">部门管理</el-menu-item>
										</router-link>
										<router-link to="/emInfo">
											<el-menu-item index="8-2">入驻年限管理</el-menu-item>
										</router-link>
										<router-link to="/rtInfo">
											<el-menu-item index="8-3">房间类型管理</el-menu-item>
										</router-link>
										<router-link to="/userInfo">
											<el-menu-item index="8-4">账号管理</el-menu-item>
										</router-link>
										<router-link to="/rzInfo">
											<el-menu-item index="8-5">操作日志</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
						</el-col>
					</el-row>
				</el-aside>
				<el-main style="border-left:solid 1px #e6e6e6">
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			function getCookie(name) {
				let str = document.cookie;
				let arr = str.split("; ");
				arr.forEach(function(ele, index) {
					let arr1 = ele.split("=");
					if(arr1[0] == name) {
						name = arr1[1];
					}
				});
				return unescape(name);
			}
			var arr={"&d-12ei1-n":0,"*&21291)()1":1,"&%$#?/<>":2,"(!0di21j102":3};
			return {
				ustatus:arr[getCookie("ustatus")],
				wname:getCookie("wname")
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(1);
			},
			handleClose(key, keyPath) {

			},
			sy() {
				this.$router.push("/");
			},
			tc() {
				this.delectCookie("login");
				this.delectCookie("uname");
				this.delectCookie("wname");
				this.$router.push("/login");
			},
			delectCookie(key) {
				let date = new Date();
				date.setTime(date.getTime() - 100);
				let ex = date.toGMTString();
				document.cookie = key + "=" + null + "; expires=" + ex;
			}
		}
	}
</script>

<style scoped="scoped">
	.el-header {
		height: 15vh !important;
		line-height: 15vh;
		background: #ccc;
		text-align: center;
	}
	
	.el-aside {
		min-height: 85vh;
	}
	
	.el-menu-item {
		text-align: center;
	}
	
	.a span {
		transition: all 0.3s;
	}
	
	.a span:hover {
		color: #ADFF2F !important;
	}
	
	::-webkit-scrollbar {
		width: 0px;
	}
</style>