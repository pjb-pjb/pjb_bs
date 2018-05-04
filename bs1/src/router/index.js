import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index.vue'
import addVisInfo from '@/components/vis/addVisInfo.vue'
import welcome from '@/components/welcome.vue'
import selectVisInfo from '@/components/vis/selectVisInfo.vue'
import editVisInfo from '@/components/vis/editVisInfo.vue'
import addGoodsSign from '@/components/goods/addGoodsSign.vue'
import selectGoods from '@/components/goods/selectGoods.vue'
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

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children:[
      	{
	      	path:"/addVisInfo",
	      	component:addVisInfo
      	},{
      		path:"",
      		component:welcome
      	},{
      		path:"/selectVisInfo",
      		component:selectVisInfo
      	},{
      		path:"/editVisInfo",
      		component:editVisInfo
      	},{
      		path:"/addGoodsSign",
      		component:addGoodsSign
      	},{
      		path:"/selectGoods",
      		component:selectGoods
      	},{
      		path:"/outGoods",
      		component:outGoods
      	},{
      		path:"/editGoodsInfo",
      		component:editGoodsInfo
      	},{
      		path:"/outInfo",
      		component:outInfo
      	},{
      		path:"/selectWorker",
      		component:selectWorker
      	},{
      		path:"/addMore",
      		component:addMore
      	},{
      		path:"/addSign",
      		component:addSign
      	},{
      		path:"/editWorker",
      		component:editWorker
      	},{
      		path:"/selectHouse",
      		component:selectHouse,
      		children:[
      			{
      				path:"/addBed1",
      				component:addBed1
      			}
      		]
      	},{
      		path:"selectService",
      		component:selectService
      	},{
      		path:"selFood",
      		component:selFood
      	},{
      		path:"enterInfo",
      		component:enterInfo
      	},{
      		path:"enterPg",
      		component:enterPg,
      		children:[
      			{
      				path:"/pgtest",
      				component:pgtest
      			}
      		]
      	}
      ]
    }
  ]
})
