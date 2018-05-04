<template>
  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="食物信息" name="first">
    	<sel v-if="flag=='sel'"  @edit="edit"></sel>
    	<edit v-else @edit="edit"></edit>
    </el-tab-pane>
    <el-tab-pane label="添加菜单" name="second">
    	<add @tz="tz"></add>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
	import edit from "./edit.vue";
	import add from "./add.vue";
	import sel from "./sel.vue";
  export default {
    data() {
      return {
        activeName2: 'first',
        flag:"sel"
      };
    },
    methods: {
    	edit(str){
    		this.flag=str;
    	},
      handleClick(tab, event) {
      },
      tz(){
      	this.activeName2="first";
      }
    },
    components:{
    	add,
    	edit,
    	sel
    }
  };
</script>
