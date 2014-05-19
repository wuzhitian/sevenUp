/* 格子排序 */
var metro = {};
metro.init=function(wrap){
	metro.gen={w:190,h:170};
	metro.wrap = wrap;
	metro.sizeArray= []; //格子,[1,2]就表示1X2的大格子
	metro.preset();
	metro.putData(wrap);
};
metro.preset = function(){
	metro.nameSpace= {};
	metro.maxY = -1;
	metro.basePos = {x:0, y:0};
	metro.memory = {flag:Infinity, x: Infinity, y:Infinity};
	metro.row = document.documentElement.offsetWidth / metro.gen.w >> 0;
	// metro.wrap.style.width = metro.row * metro.gen.w + "px";
	metro.wrap[0].style.width = metro.row * metro.gen.w + "px";
};
metro.resort=function(){
	metro.preset();
	metro.mbox = $(".MBox");
	metro.sort(metro.sizeArray);
};
metro.putData = function(list){
	(function setBig(){  //大格子初始化设置
		// var bigBox = $class("bigBox",list);
		var bigBox = list.find(".bigBox");
		if(bigBox.length==0) return false;
		var i = 0, nx, ny, bigBoxCont;
		while(i < bigBox.length){
			// bigBoxCont =  $class("innerBox",bigBox[i]);
			bigBoxCont =  bigBox.eq(i).find(".innerBox");
			nx = Math.ceil(bigBoxCont[0].offsetWidth / metro.gen.w); //bigBox横向占的块数
			ny = Math.ceil(bigBoxCont[0].offsetHeight / metro.gen.h);
			bigBox[i].style.width = nx*metro.gen.w - 10 + 'px' ;
			bigBox[i].style.height = ny*metro.gen.h - 10 + 'px' ;
			i++;
		}
	})();
	// metro.mbox = $class("MBox",list);
	metro.mbox = $(".MBox");
	var i = 0 , nx, ny, tempSizeArray = [];
	console.log(this);
	while( i < this.mbox.length){
		// if( $class("bigBox",this.mbox[i]).length > 0 ){
		if( $(this.mbox[i]).find(".bigBox").length > 0 ){
			nx = Math.ceil(this.mbox[i].offsetWidth / this.gen.w);
			nx = (nx > this.row) ? this.row : nx; //bigBox宽度尺寸过大
			ny = Math.ceil(this.mbox[i].offsetHeight / this.gen.h);
			tempSizeArray.push([nx,ny]);
		}else{
			tempSizeArray.push([1,1]);
		}
		i++;
	}
	this.sizeArray = this.sizeArray.concat(tempSizeArray);
	console.time("time2");
	metro.sort(tempSizeArray);
	console.timeEnd("time2");
}
metro.sort = function(size){
	var x = metro.basePos.x,
		y = metro.basePos.y,
		memory = metro.memory,
		name;
	for(var n=0; n < size.length ; n++){
		if(memory.flag == 0){
			x = memory.x;
			y = memory.y;
		}
		memory.flag --;
		if(x > metro.row-1){ //换行
			x = 0;
			y ++;
		}
		name = x+'_'+y;  //对象属性名（反映占领的格子）
		if(name in this.nameSpace) {  //判断属性名是否存在
			n--;
			x++;
			memory.flag < Infinity && memory.flag++;
			continue;
		}
		if(size[n][0] * size[n][1] == 1){  //普通格子
			metro.nameSpace[name]=[x,y];  //项值（反映坐标值）
			setPos(x,y,n);
			x++;
		}
		else{  //大格子
			if(beOver(x,y,size[n])) {
				if(memory.y > y){
					memory.y = y;
					memory.x = x;
				}
				if(memory.y < Infinity) memory.flag = 1;
				n--;
				x++;
				continue;
			}
			metro.nameSpace[name] = [x,y];
			setPos(x,y,n);
			hold(x,y,size[n]);
			x += size[n][0];
		}
		if(memory.flag == -1) memory = {flag:Infinity ,x: Infinity, y:Infinity};
		metro.maxY = Math.max(metro.maxY, y + size[n][1]);
	}
	metro.basePos = {"x":x,"y":y}
	metro.memory = memory;
	metro.wrap[0].style.height= metro.gen.h * metro.maxY +'px';
	function beOver(x,y,item){  //判断是否会重叠
		var name;
		if(x + item[0] > metro.row) return true; //超出显示范围
		for(var k=1; k<item[1]; k++){
			name=x+'_'+(y-0+k);
			if(name in metro.nameSpace) return true; //左侧一列有无重叠
		}
		for(k=1; k<item[0]; k++){
			name=(x-0+k)+'_'+y;
			if(name in metro.nameSpace) return true; //上侧一行有无重叠
		}
		return false;
	};
	function hold(x,y,item){  //大格子多占的位置
		for(var t=0; t < item[0]; t++) {
			for(var k=0; k < item[1]; k++){
				name = (x+t)+'_'+(y+k);
				if(t==0 && k==0)   continue;
				metro.nameSpace[name] = 0;   //多占的格子无坐标值
			}
		}
	};
	function setPos(x,y,n){
		var left = metro.gen.w * x,
			top = metro.gen.h * y;
		// metro.mbox[n].style.cssText = "position:absolute;left:"+ left +"px;top:" + top + "px;";
		$(metro.mbox[n]).css("position","absolute").animate({
			"left": left,
			"top": top
		},700);
	}
};
//随机数据
var myMetro = $("#myMetro"),
	colorList = ['#f4b300','#78ba00','#2673ec','#ae113d','#632f00','#b01e00','#4e0038','#c1004f','#7200ac','#2d004e','#006ac1','#001e4e','#008287','#004d60','#004a00','#00c13f','#15992a','#ff981d','#e56c19','#b81b1b','#ff1d77','#b81b6c','#aa40ff','#691bb8','#1faeff','#1b58b8','#56c5ff','#569ce3','#00d8cc','#00aaaa','#91d100','#b81b6c','#e1b700','#d39d09','#ff76bc','#e064b7','#00a4a4','#ff7d23','#4cafb5','#044d91','#832772','#d15a44','#de971b','#017802','#6e2ea0'],
	color = colorList[0];
var iTestforWU = 0;
function createTestData(n){
	var spanWrap = document.createElement("span"),
		content = "";
	for(var i = 0; i < n; i++) {
		color = colorList[(colorList.length * Math.random())>>0];
		if(!(Math.random()*3 >> 0)){ 
			height = Math.floor(Math.random()*200 + 100);
			width = Math.floor(Math.random()*200 + 100);
			content += '<div class="MBox"><div class="widgetBox bigBox" style="background:'+color+'"><div style="width:' + width +'px;height:' + height +'px;margin:0 auto;" class="innerBox"><img src="wenti.png" style="width: 100%;height: 100%;"></div></div></div>';
		}else{
			content += '<div class="MBox"><div class="widgetBox" style="background:'+color+'"><img src="wenti.png" style="width: 100%;height: 100%;"></div></div>';
		}
		iTestforWU++;
	};
	spanWrap.innerHTML = content;
	myMetro.append(spanWrap);
	return $(spanWrap);
}
$(document).ready(function() {
	createTestData(35);
	metro.init(myMetro);
});
// window.onload = function(){
// };
// window.onresize = function(){
// 	metro.resort(myMetro);
// };
$(window).resize(function(){
	metro.resort(myMetro);

})
// window.onscroll=function(){
// 	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
// 		windowHeight = document.documentElement.clientHeight,
// 		documentHeight = document.body.offsetHeight;
// 	if(windowHeight + scrollTop > documentHeight - 50){
// 		metro.putData(createTestData(15));
// 	}
// }