var metro = {};
metro.init=function(wrap){
	metro.gen={w:324,h:162,iSpace:10};
	metro.wrap = wrap;
	metro.sizeArray = []; //格子,[1,2]就表示1X2的大格子
	metro.preset(wrap);
	metro.putData(wrap);
};
metro.preset = function(wrap){
	metro.nameSpace= {};
	metro.maxY = -1;
	metro.basePos = {x:0, y:0};
	metro.memory = {flag:Infinity, x: Infinity, y:Infinity};
	metro.row = wrap[0].offsetWidth / metro.gen.w >> 0;
};
metro.resort=function(wrap){
	metro.preset(wrap);
	metro.sort(metro.sizeArray);
};
metro.putData = function(list){
	metro.imgBox = list.find(".imgBox");
	var i = 0, tempDivWidth, tempSizeArray = [];
	while( i < this.imgBox.length){
		tempDivWidth = this.imgBox[i].offsetWidth / this.gen.w >> 0;
		if(tempDivWidth > 1){
			tempSizeArray.push([2,2]);	//大格子占2*2
		}else{
			tempSizeArray.push([1,1]);	//小格子占1*1
		}
		i++;
	}
	this.sizeArray = this.sizeArray.concat(tempSizeArray);
	metro.sort(tempSizeArray);
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
				memory.flag = 1;
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
	metro.wrap.css("height", metro.gen.h * metro.maxY);
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
		var left = (metro.gen.w + metro.gen.iSpace)* x,
			top = (metro.gen.h + metro.gen.iSpace) * y;
		$(metro.imgBox[n]).stop().animate({
			"left": left,
			"top": top
		},500);
	}
};
metro.setContainerWidth = function(obj){
	var windowWidth = $(window).outerWidth();
	switch(true){
		case windowWidth >= metro.gen.w*5+metro.gen.iSpace*4:
			//四+1列	320*4+15*3+(320*1+15)
			obj.css({
				"width": metro.gen.w*4+metro.gen.iSpace*3,
				"float": "left"
			});
			obj.parent().css({
				"width": metro.gen.w*5+metro.gen.iSpace*4
			});
			obj.siblings().show();
			break;
		case windowWidth < metro.gen.w*5+metro.gen.iSpace*4 && windowWidth >= metro.gen.w*4+metro.gen.iSpace*3:
			//三+1列	320*3+15*2+(320*1+15)
			obj.css({
				"width": metro.gen.w*3+metro.gen.iSpace*2,
				"float": "left"
			});
			obj.parent().css({
				"width": metro.gen.w*4+metro.gen.iSpace*3
			});
			obj.siblings().show();
			break;
		case windowWidth < metro.gen.w*4+metro.gen.iSpace*3 && windowWidth >= metro.gen.w*3+metro.gen.iSpace*2:
			//三列		320*3+15*2
			obj.css({
				"width": metro.gen.w*3+metro.gen.iSpace*2,
				"float": "none"
			});
			obj.parent().css({
				"width": "auto"
			});
			obj.siblings().hide();
			break;
		case windowWidth >= 768 && windowWidth < metro.gen.w*3+metro.gen.iSpace*2:
			//二列		320*2+15
			obj.css({
				"width": metro.gen.w*2+metro.gen.iSpace*1,
				"float": "none"
			});
			obj.parent().css({
				"width": "auto"
			});
			obj.siblings().hide();
			break;
		default:
			alert("Hello world");

	}
}
var myMetro = $("#container");
var colorList = ['#f4b300','#78ba00','#2673ec','#ae113d','#632f00','#b01e00','#4e0038','#c1004f','#7200ac','#2d004e','#006ac1','#001e4e','#008287','#004d60','#004a00','#00c13f','#15992a','#ff981d','#e56c19','#b81b1b','#ff1d77','#b81b6c','#aa40ff','#691bb8','#1faeff','#1b58b8','#56c5ff','#569ce3','#00d8cc','#00aaaa','#91d100','#b81b6c','#e1b700','#d39d09','#ff76bc','#e064b7','#00a4a4','#ff7d23','#4cafb5','#044d91','#832772','#d15a44','#de971b','#017802','#6e2ea0'],
	color = colorList[0];
function creatDiv(oParent,count){	//创建测试用的DIV
	var content = "";
	for(var i = 0; i < count; i++){
		color = colorList[(Math.random()*colorList.length) >> 0];
		if(Math.random()*2 >> 0){
			content += '<div class="imgBox" style="background:'+color+'; width: '+(2*oDivPreset.width+oDivPreset.space)+'px; height: '+(2*oDivPreset.height+oDivPreset.space)+'px;"><img src="img/wenti.png" style="width: 100%;height: 100%;"></div>';
		}else{
			content += '<div class="imgBox" style="background:'+color+'; width: '+oDivPreset.width+'px; height: '+oDivPreset.height+'px;"><img src="img/wenti.png" style="width: 100%;height: 100%;"></div>';
		}
	}
	oParent.append(content);
}

var oDivPreset = {
	width: 324,
	height: 162,
	space: 10
};
var iOldContainerWidth = $("#container").css("width");
$(document).ready(function($) {
	creatDiv(myMetro,35);
	metro.init(myMetro);
});
window.onresize = function(){
	metro.setContainerWidth($("#container"));
	if(iOldContainerWidth != $("#container").css("width")){
		metro.resort(myMetro);
		iOldContainerWidth = $("#container").css("width");
	}
};
// $(window).resize(function(){
// 	if(iOldContainerWidth != $("#container").css("width")){
// 		metro.resort(myMetro);
// 		iOldContainerWidth = $("#container").css("width");
// 	}
// });