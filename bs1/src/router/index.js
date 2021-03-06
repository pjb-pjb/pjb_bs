import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index.vue'
import addVisInfo from '@/components/vis/addVisInfo.vue'
import welcome from '@/components/welcome.vue'
import selectVisInfo from '@/components/vis/selectVisInfo.vue'
import editVisInfo from '@/components/vis/editVisInfo.vue'
import addGoodsSign from '@/components/goods/addGoodsSign.vue'
import selectGoods from '@/components/goods/selectGoods.vue'
import enterInfo1 from '@/components/goods/enterInfo.vue'
import outGoods from '@/components/goods/outGoods.vue'
import editGoodsInfo from '@/components/goods/editGoodsInfo.vue'
import outInfo from '@/components/goods/outInfo.vue'
import selectWorker from '@/components/worker/selectWorker.vue'
import addSign from '@/components/worker/addSign.vue'
import addMore from '@/components/worker/addMore.vue'
import editWorker from '@/components/worker/edit.vue'
import selectHouse from '@/components/bed/house.vue'
import selectService from '@/components/logistics/selectService.vue'
import addBed1 from '@/components/bed/addBed1.vue'
import selFood from '@/components/food/select.vue'
import enterInfo from '@/components/enter/enterInfo.vue'
import enterPg from '@/components/healthcare/enterPg.vue'
import pgtest from '@/components/healthcare/pgtest.vue'
import oldAdd from '@/components/old/add.vue'
import costSelSy from '@/components/cost/selSy.vue'
import fyxq from '@/components/cost/fyxq.vue'
import oldout from '@/components/out/sel.vue'
import oldoutadd from '@/components/out/add.vue'
import retreat from '@/components/old/retreat.vue'
import jsInfo from '@/components/old/jsInfo.vue'
import dcInfo from '@/components/food/dcInfo.vue'
import dc from '@/components/food/dc.vue'
import scInfo from '@/components/food/scInfo.vue'
import login from '@/components/login.vue'
import addBar from '@/components/system/addBar.vue'
import branchInfo from '@/components/system/branchInfo.vue'
import addEm from '@/components/system/addEm.vue'
import emInfo from '@/components/system/emInfo.vue'
import addRt from '@/components/system/addRt.vue'
import rtInfo from '@/components/system/rtInfo.vue'
import rzInfo from '@/components/system/rzInfo.vue'
import userInfo from '@/components/system/userInfo.vue'
import addUser from '@/components/system/addUser.vue'
import yzInfo from '@/components/healthcare/yzInfo.vue'
import addYz from '@/components/healthcare/addYz.vue'
import editYz from '@/components/healthcare/editYz.vue'
import yzEditInfo from '@/components/healthcare/yzEditInfo.vue'
import shanshiInfo from '@/components/system/shanshiInfo.vue'
import nurseInfo from '@/components/system/nurseInfo.vue'
import pgTestInfo from '@/components/system/pgTestInfo.vue'
import addTest from '@/components/system/addTest.vue'

Vue.use(Router)

var router = new Router({
	routes: [{
			path: "/login",
			component: login
		},
		{
			path: '/',
			component: index,
			children: [{
				path: "/addVisInfo",
				component: addVisInfo
			}, {
				path: "",
				component: welcome
			}, {
				path: "/selectVisInfo",
				component: selectVisInfo
			}, {
				path: "/editVisInfo",
				component: editVisInfo
			}, {
				path: "/addGoodsSign",
				component: addGoodsSign
			}, {
				path: "/selectGoods",
				component: selectGoods
			}, {
				path: "/outGoods",
				component: outGoods
			}, {
				path: "/editGoodsInfo",
				component: editGoodsInfo
			}, {
				path: "/outInfo",
				component: outInfo
			}, {
				path: "/selectWorker",
				component: selectWorker
			}, {
				path: "/addMore",
				component: addMore
			}, {
				path: "/addSign",
				component: addSign
			}, {
				path: "/editWorker",
				component: editWorker
			}, {
				path: "/selectHouse",
				component: selectHouse,
				children: [{
					path: "/addBed1",
					component: addBed1
				}]
			}, {
				path: "selectService",
				component: selectService
			}, {
				path: "selFood",
				component: selFood
			}, {
				path: "enterInfo",
				component: enterInfo
			}, {
				path: "enterPg",
				component: enterPg,
				children: [{
					path: "/pgtest",
					component: pgtest
				}]
			}, {
				path: "/formal",
				component: oldAdd
			}, {
				path: "/costInfo",
				component: costSelSy
			}, {
				path: "/fyxq",
				component: fyxq
			}, {
				path: "/oldout",
				component: oldout
			}, {
				path: "/oldoutadd",
				component: oldoutadd
			}, {
				path: "/retreat",
				component: retreat
			}, {
				path: "/jsInfo/:oid",
				component: jsInfo
			}, {
				path: "/dcInfo",
				component: dcInfo
			}, {
				path: "/dc",
				component: dc
			}, {
				path: "/scInfo",
				component: scInfo
			}, {
				path: "/branchInfo",
				component: branchInfo
			}, {
				path: "/addBar",
				component: addBar
			}, {
				path: "/addEm",
				component: addEm
			}, {
				path: "/emInfo",
				component: emInfo
			}, {
				path: "/rtInfo",
				component: rtInfo
			}, {
				path: "/addRt",
				component: addRt
			}, {
				path: "/rzInfo",
				component: rzInfo
			}, {
				path: "/addUser/:uname",
				component: addUser
			}, {
				path: "/userInfo",
				component: userInfo
			}, {
				path: "/yzInfo",
				component: yzInfo
			}, {
				path: "/addYz/:oid",
				component: addYz
			}, {
				path: "/editYz/:did",
				component: editYz
			}, {
				path: "/yzEditInfo",
				component: yzEditInfo
			}, {
				path: "/shanshiInfo",
				component: shanshiInfo
			}, {
				path: "/nurseInfo",
				component: nurseInfo
			}, {
				path: "/enterInfo1",
				component: enterInfo1
			}, {
				path: "/pgTestInfo",
				component: pgTestInfo
			}, {
				path: "/addTest",
				component: addTest
			}]
		}
	]
})
router.beforeEach(function(to, from, next) {
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
	if(to.path == "/login") {
		next();
	} else {
		if(getCookie("login") == "yes") {
			next();
		} else {
			next("/login");
		}
	}
})
export default router;