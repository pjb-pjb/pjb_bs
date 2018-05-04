module.exports=function(){
	var arr=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	var str="";
	for(var i=0;i<5;i++){
		str+=arr[Math.ceil(Math.random()*35)];
	}
	str=new Date().getFullYear()+"."+str;
	return str;
}
