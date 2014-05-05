$(document).ready(function() {
	var iSpaceW = 15, iSpaceH = 15, iDivW = 326, iDivH = 165;
	var iCeil = Math.floor(parseInt($("#container").css("width")) / iDivW);
	var aDiv = [];			//div测试色块数组
	for(var i = 0; i < 40; i++){
		aDiv.push(createDiv(iDivW,iDivH));
	}
	var aDivWidth = [];		//div测试色块数组不同宽度对应不同值的数组
	for(var i = 0; i < aDiv.length; i++){
		var temp = Math.floor(parseInt(aDiv[i].css("width")) / iDivW);
		temp = temp == 2 ? 4: 1;
		aDivWidth.push(temp);
	}
	var aPositionSpace = [];//色块可放位置的标记数组
	for(var i = 0; i < 300; i++){
		aPositionSpace.push(1);
	}
	
	setPosition(aDiv,aDivWidth,aPositionSpace,iCeil);
	$("#container").append(aDiv);

});
function setPosition(aDiv,aDivWidth,aPositionSpace,iCeil){
	var tempIndex = 0;	//记录第一个为零的数组元素下标
	for(var j = 0; j < aDivWidth.length; j++){
		if(aDivWidth[j] == 1){	//aDivWidth[j] == 1
			for(var z = tempIndex; z < aPositionSpace.length; z++){
				if(aPositionSpace[z] == 1){		//aPositionSpace[z] == 1,表示有空位
					aPositionSpace[z] = 0;		//占位
					var tempPositionY = Math.floor(z/iCeil), tempPositionX = z % iCeil;
					tempIndex = z;
					var tempDivPosition = coordinate(tempPositionX,tempPositionY);
					aDiv[j].css({	//色块定位
						"top" : tempDivPosition.y,
						"left": tempDivPosition.x
					});
					break;
				}
			}
		}else{		//aDivWidth[j] == 4
			for(var z = tempIndex; z < aPositionSpace.length; z++){
				var tempValue = Math.abs(z % iCeil - iCeil);	//临界点取值判断，判断元素位置是否为临界点的前一个
				if(tempValue != 1 && aPositionSpace[z] == 1 && aPositionSpace[z+1] == 1){
					//占位
					/*******************************/
					aPositionSpace[z] = 0;
					aPositionSpace[z+1] = 0;
					aPositionSpace[z+iCeil] = 0;
					aPositionSpace[z+iCeil+1] = 0;
					/*******************************/
					var tempPositionY = Math.floor(z / iCeil), tempPositionX = z % iCeil;
					var tempDivPosition = coordinate(tempPositionX,tempPositionY);
					aDiv[j].css({	//色块定位
						"top" : tempDivPosition.y,
						"left": tempDivPosition.x
					});
					break;
				}else {
					continue;
				}
			}
		}
	}
}
function createDiv(iDivW,iDivH){
	var temp = $("<div></div>");
	var a = Math.round(Math.random()) + 1;
	temp.css({
		"width" : iDivW*a,
		"height": iDivH*a
	});
	return temp;
}
function coordinate(x,y){
	var temp = [];
	temp.x = x*330;
	temp.y = y*170;
	return temp;
}