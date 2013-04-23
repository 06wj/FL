fl.showIdleMessage(false);

var baseURI = fl.baseURI = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/")) + "/";
fl.runScript(baseURI + "utils.jsfl");
log(baseURI, "start");

var data = {};

data.shape = getShapeData();
data.mc = getMcData();
data.map = getMapData();
data.hit = getHitData();

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
	var shape = fl.getLayerByName("shape").frames[0].elements[0];
	var edges = shape.edges;

	var indexHash = {};
	edges.forEach(function(edge){
		if(!indexHash[edge.cubicSegmentIndex]){
			indexHash[edge.cubicSegmentIndex] = {isLine:edge.isLine}
		}
	});
	
	var lines = data.lines;
	var beziers = data.beziers;
	
	var drawData = [];

	for(var index in indexHash)
	{
		var isLine = indexHash[index].isLine;
		var arr = shape.getCubicSegmentPoints(parseInt(index));
		drawData.push([createPoint(arr[0]), createPoint(arr[1]),createPoint(arr[2]), createPoint(arr[3])]);
	}


	var result = [];

	while(drawData.length > 0)
	{
		var subData = [];
		subData.push(drawData.shift());
		while (getNext(subData, drawData)) {
					
		}
		result.push(subData);
	}

	return result;
}

function getNext(arr, drawData)
{
	var last = arr[arr.length - 1];
	for (var i = 0; i < drawData.length; i ++)
	{
		var tmp = drawData[i];
		if (tmp[0].x == last[3].x && tmp[0].y == last[3].y)
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
	var data = {};
	var elems = fl.getLayerByName("mc").frames[0].elements;
	elems.forEach(function(elem){
		var name = fl.getLibraryName(elem);
		data[name] = data[name]||[];
		data[name].push(createPoint(elem))
	});
	return data;
}
var str = "var mapData = " + JSON.stringify(data);
FLfile.write(baseURI + "/mapData.js", str)
log("end\n");


