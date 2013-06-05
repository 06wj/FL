fl.showIdleMessage(false);
 
var baseURI = fl.baseURI = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/")) + "/";
fl.runScript(baseURI + "utils.jsfl");
log(baseURI, "start");
 
var data = {};
 
data.shape = getShapeData();
data.mc = getMcData();
data.map = getMapData();
data.hit = getHitData();
data.floor = getFloorData();

function createPoint(obj)
{
  return {x:obj.x, y:obj.y};
}
 
function getMapData()
{
	return {
		width:doc.width,
		height:doc.height,
	};
}
 
function getHitData()
{
	if(!fl.getLayerByName("hit")) return null;
 
	var data = {lines:[], beziers:[]};
	var shape = fl.getLayerByName("hit").frames[0].elements[0];
	var edges = shape.edges;
 
	var indexHash = {};
	edges.forEach(function(edge){
		if(!indexHash[edge.cubicSegmentIndex]){
			indexHash[edge.cubicSegmentIndex] = {isLine:edge.isLine}
		}
	});
	
	var lines = data.lines;
	var beziers = data.beziers;
	
	for(var index in indexHash)
	{
		var isLine = indexHash[index].isLine;
		var arr = shape.getCubicSegmentPoints(parseInt(index));
 
		if(isLine)
		{
			lines.push([createPoint(arr[0]), createPoint(arr[3])]);
		}
		else
		{
			beziers.push([createPoint(arr[0]), createPoint(arr[1]),createPoint(arr[2]), createPoint(arr[3])])
		}
	}
	return data;
}
 
function getShapeData()
{	
	if(!fl.getLayerByName("shape")) return null;
	
	var getData = function(elem){
		var edges = elem.edges;
		var result = [];
		var type;
		
		if(elem.isRectangleObject)
		{
			type = "rect";
			result = [{color:elem.contours[1].fill.color,x:elem.left, y:elem.top, width:elem.width, height:elem.height}];
		}
		else if(elem.isOvalObject)
		{
			type = "oval";
		}
		else
		{
			type = "bezier";
 
			var drawData = [];
			edges.forEach(function(edge){
				drawData.push([createPoint(edge.getControl(0)), createPoint(edge.getControl(1)),createPoint(edge.getControl(2))]);
			});
			
			while(drawData.length > 0)
			{
				var subData = [];
				subData.push(drawData.shift());
				while (getNext(subData, drawData)) {
					
				}
				result.push(subData);
			}
		}
 
		return {type:type, data:result};
	}
 
	var data = {};
	for each(var elem in fl.getLayerByName("shape").frames[0].elements)
	{
		var tmp = getData(elem);
		data[tmp.type] = data[tmp.type]||[];
 
		tmp.data = Object.prototype.toString.call([])=="[object Array]"?tmp.data:[tmp.data];
		data[tmp.type] = data[tmp.type].concat(tmp.data);
	}
	return data;
}
 
function getNext(arr, drawData)
{
	var last = arr[arr.length - 1];
	for (var i = 0; i < drawData.length; i ++)
	{
		var tmp = drawData[i];
		if (tmp[0].x == last[2].x && tmp[0].y == last[2].y)
		{
			drawData.splice(i, 1);
			arr.push(tmp);
			return tmp;
		}
	}
	return null;
}
 
function getMcData()
{
	if(!fl.getLayerByName("mc")) return null;
 
	var data = {};
	var elems = fl.getLayerByName("mc").frames[0].elements;
	elems.forEach(function(elem){
		var name = fl.getLibraryName(elem);
		data[name] = data[name]||[];
		data[name].push(createPoint(elem))
	});
	return data;
}
 
function getFloorData()
{
	fl.editItem("floor");
	var data = [];
 
	for each(var layer in layers)
	{
		var points = [];
		for(var i = 0;i < layer.frames.length;)
		{
			var f = layer.frames[i];
			var elem = f.elements[0];
			var fd = f.duration;
			var data;
			points.push({
				x:elem.x,
				y:elem.y
			});
			i += fd;
		}
		data.push({
			name:fl.getLibraryName(elem),
			data:points
		});
	}

	fl.getDocumentDOM().exitEditMode();
	fl.init();
	return data;
}
  
var str = "var mapData = " + JSON.stringify(data);
FLfile.write(baseURI.replace("mapEditor/","") + "mapData.js", str)
log("end\n");