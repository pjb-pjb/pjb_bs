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
}
*{
	margin: 0;
	padding: 0;
	font-style: normal;
	-webkit-user-select: none;
}
ui,li{
	list-style: none;
}
img{
	
}
a{
	text-decoration: none;
}
th,td{
	text-align: center !important;
}
.el-tabs .el-tabs__content{
		position: static !important;
}
.sel{
		padding: 5px;
		height: 35px;
		width: 200px;
		font-size: 20px;
		letter-spacing: 5px;
	}
	.el-submenu>div{
		height: 45px !important;
		line-height: 45px !important;
	}
	.el-menu{
		border: none !important;
	}
	.el-menu-item{
		height: 44px !important;
		line-height: 44px !important;
	}
	.el-menu-item-group>div{
		height: 0 !important;
		padding: 0 !important;
	}
	::-webkit-scrollbar {
        width: 0px;
    }
</style>
