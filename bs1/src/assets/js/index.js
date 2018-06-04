$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function() {
	let data = remote_ip_info;
	$("#curCity-name").html(data.city);
	$("#city").html(data.city);
	$("#province").html(data.province);
	getData(data.city);
});
function getData(city){
	let colorObj={"优":"#B1F12C","良":"#FFFF00","轻度污染":"#FF7E00","中度污染":"#FF0000","重度污染":"#99004C","严重污染":"#7E0023"};
	let weekOjb={
		"0":"今天",
		"1":"明天",
		"星期一":"周一",
		"星期二":"周二",
		"星期三":"周三",
		"星期四":"周四",
		"星期五":"周五",
		"星期六":"周六",
		"星期日":"周日",
	};
	$.ajax({
		url:"http://api.jisuapi.com/weather/query",
		dataType:"jsonp",
		data:"appkey=926884ec8a444041&city="+city,
		success:function(r){
			let str="";
			let arr1=[],arr2=[];
			let data=r.result;
			$("#nowTemp").html(data.temp);
			$("#tempHigh").html(data.temphigh);
			$("#tempLow").html(data.templow);
			$("#nowWeather").html(data.weather);
			$("#updateTime").html(data.updatetime.slice(11,16));
			$("#windpower1").html(data.windpower);
			$("#windspeed").html(data.winddirect);
			$("#quality-text").html(data.aqi.quality+" "+data.aqi.aqi);
			$("#otherInfo-img").attr("src","img-dayWeather/"+data.img+".png");
			$(".quality-line").css("background-color",colorObj[data.aqi.quality]);
			$.each(data.daily.slice(0,6),function(index,val){
				str+=`
					<li>
						<span class="data">${(index==0||index==1)?weekOjb[index]:weekOjb[val.week]}</span>
						<img src="img-dayWeather/${val.day.img}.png" class="data-img"/>
						<div class="temp-show">
							<span class="tempLow">${val.night.templow}</span><i>/</i><span class="tempHigh">${val.day.temphigh}</span>
						</div>
						<span class="weather">${val.day.weather}</span>
					</li>
				`;
			});
			$(".future-weather-box").html(str);
			$.each(data.hourly,function(index,val){
				if(index%2==0){
					arr1.push(val.time);
					arr2.push(val.temp);
				}
			});
			myChart(arr1,arr2);
		}
	});
}
function myChart(arr1,arr2){
	var myChart = echarts.init(document.querySelector("#main"));
	option = {
		textStyle:{
			color:"#fff"
		},
		grid: {
	        left: '0%',
	        right:'0%',
	    },
		xAxis: {
			type: 'category',
			data: arr1,
			position:"bottom",
			axisTick: {
				show: false,
			},
			axisLine:{
				lineStyle:{
					color:"rgba(255,255,255,0.2)",
				}
			}
		},
		yAxis: {
			type: 'value',
			show: false,
			max:"dataMax",
		},
		series: [{
			data: arr2,
			type: 'line',
			label:{
				normal:{
					formatter: '{c}°C',
					show:true,
					position:"top"
				}
			}
		}]
	};
	myChart.setOption(option);
}
let main1=$("#main");
var main=new Hammer(main1[0]);
let x1,x2,x3=0,movex=0;
let max=main1.outerWidth();
main.on("panstart",function(e){
	x1=e.center.x;
	main1.css("transform","translateX("+x3+")")
});
main.on("panmove",function(e){
	movex=x3+e.center.x-x1;
	if(movex<-max/2){
		movex=-max/2;
		main1.css("transform","translateX("+movex+"px)");
		return;
	}else if(movex>0){
		movex=0;
		main1.css("transform","translateX("+movex+"px)");
		return;
	}
	main1.css("transform","translateX("+movex+"px)");
});
main.on("panend",function(e){
	x3=movex;
});
let arr=[];
let pro;
$(".curCity").click(function(){
	$(".mask").fadeIn();
	$.ajax({
		url:"http://api.jisuapi.com/weather/city",
		dataType:"jsonp",
		data:"appkey=926884ec8a444041",
		success:function(r){
			let str="";
			arr=r.result;
			let provice=$.grep(arr,function(val,index){
				return val.parentid==0;
			});
			$.each(provice, function(index,val) {
				str+=`
					<li class="provice" id="${val.cityid}">${val.city}</li>
				`;
			});
			$(".mask").html(str);
		}
	});
});
$(".mask").on("click",".provice",function(e){
	let id=$(this).attr("id");
	let str="";
	pro=this.innerHTML;
	let city=$.grep(arr,function(val,index){
		return val.parentid==id;
	});
	$.each(city,function(index,val){
		str+=`
			<li class="city">${val.city}</li>
		`;
	});
	$(".mask").html(str);
}).on("click",".city",function(){
	$(".mask").fadeOut();
	$("#curCity-name").html(this.innerHTML);
	$("#city").html(this.innerHTML);
	$("#province").html(pro);
	getData(this.innerHTML);
}).on("click",function(e){
	if(e.target.className=="mask"){
		$(this).fadeOut();
	}
});
$(".refresh").click(function(){
	getData($("#curCity-name").html());
});
