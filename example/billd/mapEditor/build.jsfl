fl.showIdleMessage(false);

var baseURI = fl.baseURI = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/")) + "/";
fl.runScript(baseURI + "utils.jsfl");
log(baseURI, "start");

var data = {};

data.shape = getShapeData();
data.mc = getMcData();
data.player = getPlayerData();

function createPoint(obj)
{
	return {x:obj.x, y:obj.y};
}

function getShapeData()
{
	var data = {lines:[], beziers:[]};
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
	
	for(var index in indexHash)
	{
		var isLine = indexHash[index].isLine;
		var arr = shape.getCubicSegmentPoints(parseInt(index));
		if(isLine)
		{
			lines.push([createPoint(arr[0]), createPoint(arr[2])]);
		}
		else
		{
			beziers.push([createPoint(arr[0]), createPoint(arr[1]),createPoint(arr[2]), createPoint(arr[3])])
		}
	}
	return data;
}

function getMcData = function()
{
	var data = {};
	var elems = fl.getLayerByName("mc").frames[0];
	elems.forEach(function(elem){
		var name = fl.getLibraryName(elem);
		data[name] = data[name]||[];
		data[name].push(createPoint(elem))
	});
	return data;
}

function getPlayerData = function()
{
	var player = fl.getLayerByName("player").frames[0].elements[0];
	return createPoint(player);
}

var str = "var mapData = " + JSON.stringify(data);
FLfile.write(baseURI.replace(/mapEditor/, "") + "mapData.js", str)

log("end\n");

