fl.showIdleMessage(false);

var baseURI = fl.baseURI = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/")) + "/";
fl.runScript(baseURI + "utils.jsfl");
log(baseURI, "start");

shape = elems[0];
edges = shape.edges;

var indexHash = {};
edges.forEach(function(edge){
	if(!indexHash[edge.cubicSegmentIndex]){
		indexHash[edge.cubicSegmentIndex] = {isLine:edge.isLine}
	}
});

function createPoint(obj){
	return {x:obj.x, y:obj.y};
}

data = {lines:[], beziers:[]};
lines = data.lines;
beziers = data.beziers;
for(var index in indexHash)
{
	var isLine = indexHash[index].isLine;
	var arr = shape.getCubicSegmentPoints(parseInt(index));
	if(isLine)
	{
		lines.push([createPoint(arr[0]), createPoint(arr[1])]);
	}
	else
	{
		beziers.push([createPoint(arr[0]), createPoint(arr[1]),createPoint(arr[2]), createPoint(arr[3])])
	}
}

var str = "var mapData = " + JSON.stringify(data);
FLfile.write(baseURI.replace(/mapEditor/, "") + "mapData.js", str)

log("end\n");

