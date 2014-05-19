$(document).ready(function() {
	var container = $("#container");
	var iSpace = 10, iDivW = 324, iDivH = 162;
	// setContainerWidth(container);
	var iCeil = Math.floor(parseInt($("#container").css("width")) / iDivW);
	var aDiv = [];				//div测试色块数组
	for(var i = 0; i < 30; i++){
		var temp = createDiv();
		aDiv.push(temp);
	}
	var aDivWidth = [];			//div测试色块数组不同宽度对应不同值的数组
	for(var i = 0; i < aDiv.length; i++){
		var temp = Math.floor(parseInt(aDiv[i].css("width")) / iDivW);
		temp = temp == 2 ? 4: 1;
		aDivWidth.push(temp);
	}
	var aPositionSpace = [];	//div可放位置的标记数组
	for(var i = 0; i < aDiv.length*6; i++){
		aPositionSpace.push(1);
	}
	var aDivPositionRatio = recordPosition(); //div该放位置的系数
	/******************************************/
	//div定位
	/******************************************/
	function setDivPosition(){
		for(var i = 0; i < aDiv.length; i++){	//读出aDiv[i]的相应位置系数并且定位
			var tempDivPosition = coordinate(aDivPositionRatio[i][0],aDivPositionRatio[i][1]);
			aDiv[i].css({
				"top": 	tempDivPosition.y,
				"left": tempDivPosition.x
			});
		};
		aPositionSpace = [];	//重置'div可放位置的标记数组',用于下次resize
		for(var i = 0; i < aDiv.length*6; i++){
			aPositionSpace.push(1);
		}
	}
	setDivPosition();
	$("#container").append(aDiv);
	var oldContainerWidth = $("#container").css("width");
	$(window).resize(function(){	
		// setContainerWidth(container);
		if(oldContainerWidth != $("#container").css("width")){	//如果$("#container").css("width")没有变化，则不需要重排$("#container div");
			oldContainerWidth = $("#container").css("width");
			iCeil = Math.floor(parseInt($("#container").css("width")) / iDivW);
			aDivPositionRatio = recordPosition();
			var tempDivPosition;
			console.time("time1");
			$("#container div").each(function(index){
				tempDivPosition = coordinate(aDivPositionRatio[index][0],aDivPositionRatio[index][1]);
				$(this).stop().animate({
					"top": tempDivPosition.y,
					"left": tempDivPosition.x
				},700);
			});
			console.timeEnd("time1");
			aPositionSpace = [];
			for(var i = 0; i < aDiv.length*6; i++){
				aPositionSpace.push(1);
			};
		}
	});
	// window.addEventListener("orientationchange",function(){
	// 	if(oldContainerWidth != $("#container").css("width")){	//如果$("#container").css("width")没有变化，则不需要重排$("#container div");
	// 		oldContainerWidth = $("#container").css("width");
	// 		iCeil = Math.floor(parseInt($("#container").css("width")) / iDivW);
	// 		aDivPositionRatio = recordPosition();
	// 		var tempDivPosition;
	// 		console.time("time1");
	// 		$("#container div").each(function(index){
	// 			tempDivPosition = coordinate(aDivPositionRatio[index][0],aDivPositionRatio[index][1]);
	// 			$(this).stop().animate({
	// 				"top": tempDivPosition.y,
	// 				"left": tempDivPosition.x
	// 			},500);
	// 		});
	// 		console.timeEnd("time1");
	// 		aPositionSpace = [];
	// 		for(var i = 0; i < aDiv.length*6; i++){
	// 			aPositionSpace.push(1);
	// 		};
	// 	}
	// });
	/******************************************/
	//根据当前的可视区宽度定义
	//$("#container"),$("#container").siblings(),$("#container").parent();的宽度,
	//并判断sidebar-Nav是否该显示
	/******************************************/
	function setContainerWidth(obj){
		var windowWidth = $(window).outerWidth();
		switch(true){
			case windowWidth >= iDivW*5+iSpace*4:
				//四+1列	320*4+15*3+(320*1+15)
				console.log("iDivW*5+iSpace*4::"+(iDivW*5+iSpace*4));
				obj.css({
					"width": iDivW*4+iSpace*3,
					"float": "left"
				});
				obj.parent().css({
					"width": iDivW*5+iSpace*4
				});
				obj.siblings().show();
				break;
			case windowWidth < iDivW*5+iSpace*4 && windowWidth >= iDivW*4+iSpace*3:
				//三+1列	320*3+15*2+(320*1+15)
				console.log("iDivW*4+iSpace*3::"+(iDivW*4+iSpace*3));
				obj.css({
					"width": iDivW*3+iSpace*2,
					"float": "left"
				});
				obj.parent().css({
					"width": iDivW*4+iSpace*3
				});
				obj.siblings().show();
				break;
			case windowWidth < iDivW*4+iSpace*3 && windowWidth >= iDivW*3+iSpace*2:
				//三列		320*3+15*2
				console.log("iDivW*3+iSpace*2::"+(iDivW*3+iSpace*2));
				obj.css({
					"width": iDivW*3+iSpace*2,
					"float": "none"
				});
				obj.parent().css({
					"width": "auto"
				});
				obj.siblings().hide();
				break;
			case windowWidth >= 768 && windowWidth < iDivW*3+iSpace*2:
				console.log("iDivW*3+iSpace*2::"+(iDivW*3+iSpace*2));
				//二列		320*2+15
				obj.css({
					"width": iDivW*2+iSpace*1,
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
	/******************************************/
	//返回值为aPositionRecord,函数用于录入aDiv[i]相应的摆放位置系数
	/******************************************/
	function recordPosition(){
		var aPositionRecord = []; //记录Div的x系数与y系数
		var tempIndex = 0;	//记录第一个为零的数组元素下标
		for(var j = 0; j < aDivWidth.length; j++){
			if(aDivWidth[j] == 1){	//aDivWidth[j] == 1
				for(var z = tempIndex; z < aPositionSpace.length; z++){
					if(aPositionSpace[z] == 1){		//aPositionSpace[z] == 1,表示有空位
						aPositionSpace[z] = 0;		//占位
						var tempPositionY = Math.floor(z/iCeil), tempPositionX = z % iCeil;
						aPositionRecord.push([tempPositionX,tempPositionY]);
						tempIndex = z;
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
						aPositionRecord.push([tempPositionX,tempPositionY]);
						break;
					}
				}
			}
		}
		return aPositionRecord;
	}
	/******************************************/
	//创建测试用的div
	/******************************************/
	function createDiv(){	
		var temp = $("<div></div>");
		var a = Math.round(Math.random()) + 1;
		if(a == 2){
			temp.css({
				"width" : iDivW*2+iSpace,
				"height": iDivH*2+iSpace
			});
		}else {
			temp.css({
				"width" : iDivW,
				"height": iDivH
			});
		}
		return temp;
	}
	/******************************************/
	//根据各个div相应的位置系数计算div的横纵坐标
	/******************************************/
	function coordinate(x,y){
		var temp = [];
		temp.x = x == 0 ? 0 : x*(iDivW+iSpace);
		temp.y = y == 0 ? 0 : y*(iDivH+iSpace);
		return temp;
	}
});