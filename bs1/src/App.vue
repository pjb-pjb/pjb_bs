<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		width: 100%;
		height: 100%;
	}
	
	* {
		margin: 0;
		padding: 0;
		font-style: normal;
		-webkit-user-select: none;
	}
	
	ui,
	li {
		list-style: none;
	}
	
	img {}
	
	a {
		text-decoration: none;
	}
	
	th,
	td {
		text-align: center !important;
	}
	
	.el-tabs .el-tabs__content {
		position: static !important;
	}
	
	.sel {
		padding: 5px;
		height: 35px;
		width: 200px;
		font-size: 20px;
		letter-spacing: 5px;
	}
	
	.el-submenu>div {
		height: 45px !important;
		line-height: 45px !important;
	}
	
	.el-menu {
		border: none !important;
	}
	
	.el-menu-item {
		height: 44px !important;
		line-height: 44px !important;
	}
	
	.el-menu-item-group>div {
		height: 0 !important;
		padding: 0 !important;
	}
	
	::-webkit-scrollbar {
		width: 0px;
	}
	
	html,
	body {
		width: 100%;
		height: 100%;
	}
	
	.future-weather-box li {
		box-sizing: border-box;
		height: 100%;
		width: 16.66667%;
		float: left;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 5px 3px;
		align-items: center;
		border-right: 1px dotted #ccc;
	}
	
	.future-weather-box li:last-child {
		border: none;
	}
	
	.data {
		font-size: 18px;
	}
</style>