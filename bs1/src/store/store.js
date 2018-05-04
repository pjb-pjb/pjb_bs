import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
var store=new Vuex.Store({
	state:{
		height:0,
		hnum:"",
		hname:"",
		wc:true,
		sid:"",
		fid:'',
		rid:"",
		oid:"",
		score:0,
		isAll:false,
		bedDatas:[]
	},
	mutations:{
		setWc(state){
			state.wc=!state.wc;
		}
	}
});
export default store;	