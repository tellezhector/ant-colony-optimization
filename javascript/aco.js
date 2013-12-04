aco = {};
aco.color = d3.scale.category20();

aco.settings = 
{
	"width" 		: 1000,
	"height" 		: 700,
	"charge" 		: -400,
	"linkDistance" 	: 30,
	"linkColor"		: "#666666"
}

aco.layout = function(selector)
{	
	aco.width = aco.settings.width;
	aco.height = aco.settings.height;

	aco.force = d3.layout.force()
		.charge(aco.settings.charge)
		.linkDistance(aco.settings.linkDistance)
		.size([aco.width, aco.height]);

	aco.svg = d3.select(selector)
		.append("svg")
		.attr("width", aco.width)
		.attr("height", aco.height);
}

aco.draw = function(graph, selector)
{
  var newselector = selector + " svg";
  console.log(newselector);
  d3.select(newselector).remove();
  aco.layout(selector);
  aco.force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = aco.svg.selectAll(".link")
      .data(graph.links)
      .enter()
	  .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
	  .style("stroke", 
		function(d){ return d.color; }
	);

  var node = aco.svg.selectAll(".node")
      .data(graph.nodes)
      .enter()
	  .append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return aco.color(d.group); })
      .call(aco.force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  aco.force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
}

aco.setPathColor = function(graph, path, color)
{	
	var min = _.min(path);
	if(min < 0)
	{
		throw("Node " + min + " not defined.");
	}
	
	var max = _.max(path);
	if(max > graph.nodes.length - 1)
	{
		throw("Node " + max + " not defined.");
	}
	
	for (var i = 0; i < path.length - 1; i++)
	{	
		var source = path[i];
		var target = path[i+1];
		var link = _.find(
				graph.links, 
				function(l){
					var inOrder = (l.source.index == source && l.target.index == target);
					var reverse = (l.source.index == target && l.target.index == source);
					
					return inOrder || reverse;
				}
			);

		if (typeof link == "undefined")
		{
			throw("Couldn't find edge (" + source + ", " + target + ").");
		}
		
		link.color = color;
	}
}

aco.setLinksColor = function(graph, color)
{
	_.each(graph.links, function(l){l.color = color; });
}

aco.resetLinksColor = function()
{
	aco.setLinksColor(aco.settings.linkColor);
}

aco.randomGraph = function(n, p)
{
	var adjacency = aco.randomAdjacency(n, p);
	var graph = aco.graphFromAdjacency(adjacency);
	return graph;
}

aco.drawRandomGraph = function(n, p)
{	
	var graph = aco.randomGraph(n, p);
	aco.redraw(graph);
	return graph;
}

aco.graphFromAdjacency = function (adjacency)
{
	var graph = {};
	graph.adjacency = adjacency;
	graph.nodes = [];
	graph.links = [];
	var length = adjacency.length;
	for (var i = 0; i < length; i++)
	{
		var node = { "name" : i, "group" : i == 0 ? 1 : 2, x : i*50, y : i*50};
		graph.nodes.push(node); 
		for (var j = i+1; j < length; j++)
		{
			var value = adjacency[i][j];
			if(value > 0)
			{
			    var link = { "source" : i, "target" : j, "value" : value, "color" : aco.settings.linkColor};
				graph.links.push(link);
			}
		}
	}
	
	return graph;
}

aco.randomAdjacency = function(n, p)
{
	if (typeof p === "undefined")
	{
		p = 0.5;
	}
	
	var adjacency = [];
	
	for(var i = 0; i < n; i++)
	{
		adjacency.push(aco.zeroRow(n));

		for(var j = i+1; j < n; j++)
		{
			adjacency[i][j] = aco.randomZeroOne(p);
		}
		
		if (_.max(adjacency[i]) == 0)
		{
			var oneAt = aco.randomInt(n - i - 1) + i;
			adjacency[i][oneAt] = 1;
		}
	}
	
	return adjacency;
}

aco.zeroRow = function(n)
{
	var row = [];
	for(var i = 0; i < n; i++)
	{
		row.push(0);
	}
	
	return row;
}

aco.randomZeroOne = function(p)
{
	return (Math.random() < p) * 1;
}

aco.randomInt = function(max)
{
	return Math.floor(Math.random() * max) + 1;
}

aco.names = 
[
"Myriel",
"Napoleon",
"Mlle.Baptistine",
"Mme.Magloire",
"CountessdeLo",
"Geborand",
"Champtercier",
"Cravatte",
"Count",
"OldMan",
"Labarre",
"Valjean",
"Marguerite",
"Mme.deR",
"Isabeau",
"Gervais",
"Tholomyes",
"Listolier",
"Fameuil",
"Blacheville",
"Favourite",
"Dahlia",
"Zephine",
"Fantine",
"Mme.Thenardier",
"Thenardier",
"Cosette",
"Javert",
"Fauchelevent",
"Bamatabois",
"Perpetue",
"Simplice",
"Scaufflaire",
"Woman1",
"Judge",
"Champmathieu",
"Brevet",
"Chenildieu",
"Cochepaille",
"Pontmercy",
"Boulatruelle",
"Eponine",
"Anzelma",
"Woman2",
"MotherInnocent",
"Gribier",
"Jondrette",
"Mme.Burgon",
"Gavroche",
"Gillenormand",
"Magnon",
"Mlle.Gillenormand",
"Mme.Pontmercy",
"Mlle.Vaubois",
"Lt.Gillenormand",
"Marius",
"BaronessT",
"Mabeuf",
"Enjolras",
"Combeferre",
"Prouvaire",
"Feuilly",
"Courfeyrac",
"Bahorel",
"Bossuet",
"Joly",
"Grantaire",
"MotherPlutarch",
"Gueulemer",
"Babet",
"Claquesous",
"Montparnasse",
"Toussaint",
"Child1",
"Child2",
"Brujon",
"Mme.Hucheloup"
];

var adjacency = aco.randomAdjacency(20, 0.05);
graph = aco.graphFromAdjacency(adjacency);
aco.draw(graph, "body");