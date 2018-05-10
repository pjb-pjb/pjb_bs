<template>
	<div class="root">
		<el-container>
			<el-header>Header</el-header>
			<el-container>
				<el-aside width="250px">
					<el-row class="tac">
						<el-col :span="24">
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
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
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="2">
									<template slot="title">
										<i class="el-icon-location"></i>
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
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="3">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>员工管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/selectWorker">
											<el-menu-item index="3-1">员工信息</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="4">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>床位管理</span>
									</template>
									<el-menu-item-group>
										<router-link to="/selectHouse">
											<el-menu-item index="4-1">查看信息</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="5">
									<template slot="title">
										<i class="el-icon-location"></i>
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
											<el-menu-item index="5-1-1">食谱设置</el-menu-item>
										</router-link>
									</el-submenu>
								</el-submenu>
							</el-menu>
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="6">
									<template slot="title">
										<i class="el-icon-location"></i>
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
							<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
								<el-submenu index="7">
									<template slot="title">
										<i class="el-icon-location"></i>
										<span>医护工作站</span>
									</template>
									<el-menu-item-group>
										<router-link to="/enterPg">
											<el-menu-item index="7-1">入驻评估</el-menu-item>
										</router-link>
									</el-menu-item-group>
								</el-submenu>
							</el-menu>
						</el-col>
					</el-row>
				</el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				//					console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				//					console.log(key, keyPath);
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
		height: 85vh;
	}
	
	.el-menu-item {
		text-align: center;
	}
</style>