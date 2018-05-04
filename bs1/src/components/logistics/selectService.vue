<template>
  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="已维修" name="first">
    	<selYes></selYes>
    </el-tab-pane>
    <el-tab-pane label="未维修" name="second">
    	<selNo v-if="flag=='sel'"  @edit="edit"></selNo>
    	<edit v-else @edit="edit"></edit>
    </el-tab-pane>
    <el-tab-pane label="维修登记" name="three">
    	<addSer @tz="tz"></addSer>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
	import edit from "./edit.vue";
	import addSer from "./addSer.vue";
	import selNo from "./selNo.vue";
	import selYes from "./selYes.vue";
  export default {
    data() {
      return {
        activeName2: 'second',
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
      	this.activeName2="second";
      }
    },
    components:{
    	addSer,
    	selNo,
    	selYes,
    	edit
    }
  };
</script>
