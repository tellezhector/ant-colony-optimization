aco = {};
aco.color = d3.scale.category20();

aco.settings = 
{
	"width" 		: 800,
	"height" 		: 500,
	"charge" 		: -500,
	"linkDistance" 	: 200,
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

aco.colorPath = function(graph, path, selector)
{
	aco.setPathColor(graph, path, "#FF0000");
	aco.draw(graph, selector);
}

aco.setLinksColor = function(graph, color)
{
	_.each(graph.links, function(l){l.color = color; });
}

aco.resetLinksColor = function(graph)
{
	aco.setLinksColor(graph, aco.settings.linkColor);
}

aco.randomGraph = function(n, p, options)
{
	var adjacency = aco.randomAdjacency(n, p, options);
	var graph = aco.graphFromAdjacency(adjacency);
	return graph;
}

aco.drawRandomGraph = function(n, p)
{	
	var graph = aco.randomGraph(n, p);
	aco.redraw(graph);
	return graph;
}

aco.pathLength = function(graph, path)
{
	var n = path.length;
	var value = 0;
	for(var i = 0; i < n-1; i++)
	{
		value = value + graph.adjacency[path[i]][path[i+1]]
	}
	
	return value;
}

aco.graphFromAdjacency = function (adjacency)
{
	var graph = {};
	graph.adjacency = adjacency;
	graph.paths = [];
	graph.pathLengths = [];
	graph.nodes = [];
	graph.links = [];
	var length = adjacency.length;
	for (var i = 0; i < length; i++)
	{
		var group = 2;
		if(i == 0)
		{
			group = 1;
		}
	
		var node = { "name" : aco.names[i], "group" : group, x : i*50, y : i*50};
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
	
	graph.trails = aco.initialTrail(adjacency);
	return graph;
}

aco.initialTrail = function(adjacency)
{
	var n = adjacency.length;
	trails = [];
	for(var i = 0; i < n; i++)
	{
		trails[i] = aco.zeroRow(n);
		for(var j = 0; j < n; j++)
		{
			if(i == j)
			{
				continue;
			}
			if(adjacency[i][j] != 0)
			{
				trails[i][j] = 1;
			}
		}
	}
	
	return trails;
}

aco.updateTrail = function(graph)
{
	if(graph.paths.length == 0)
	{
		return;
	}
	
	var n = graph.adjacency.length;
	for(var i = 0; i < n; i++)
	{
		for(var j=i+1; j < n; j++)
		{
			graph.trails[i][j] = (0.75) * graph.trails[i][j] + aco.getDeltaTau(graph, i, j);
			graph.trails[j][i] = graph.trails[i][j];
		}
	}
	
	graph.paths = [];
	graph.pathLengths = [];
}

aco.getDeltaTau = function(graph, i, j)
{
	var n = graph.paths.length;
	var value = 0;
	for(var k = 0; k < n; k++)
	{
		var path = graph.paths[k];
		for(var l = 0; l < (path.length - 1); l++)
		{
			if(path[l] == i && path[l+1] == j)
			{
				value = value + 1/graph.pathLengths[k];
				break;
			}

			if(path[l] == j && path[l+1] == i)
			{
				value = value + 1/graph.pathLengths[k];
				break;
			}
		}
	}
	
	return value;
}

aco.getPath = function(graph)
{
	var n = graph.adjacency.length;
	path = [0];
	for (var i = 1; i < n; i++)
	{
		path.push(aco.nextNodeInPath(graph, path));
	}
	path.push(0);
	return path;
}

aco.nextNodeInPath = function(graph, path)
{
	var last = _.last(path);
	var n = graph.adjacency.length;
	var probabilities = [];
	var availables = []
	for (var i = 0; i < n; i++)
	{
		if(_.contains(path, i))
		{
			continue;
		}
		
		availables.push(i);
		probabilities.push(graph.trails[last][i] * (1/Math.pow(graph.adjacency[last][i], 2)));
	}
	
	probabilities = aco.updateProbabilities(probabilities);
	return aco.randomNeighbor(probabilities, availables);
}

aco.randomNeighbor = function(probabilities, availables)
{
	var n = probabilities.length;
	var random = Math.random();
	var current = 0;
	for(var i = 0; i < n; i++)
	{
		current = current + probabilities[i];
		if (random < current)
		{
			return availables[i];
		}
	}
	
	alert("Oh my god.");
	throw("something nasty has happened.");
}

aco.updateProbabilities = function(probabilities)
{
	var n = probabilities.length;
	var total = aco.sum(probabilities);
	for(var i = 0; i < n; i++)
	{
		probabilities[i] = probabilities[i]/total;
	}
	
	return probabilities;
}

aco.sum = function(a)
{
	return _.reduce(a, function(memo, num){ return memo + num; }, 0);
}

aco.randomAdjacency = function(n, p, options)
{
	var maxWeight = 20;
	if (typeof options !== "undefined")
	{
		maxWeight = options.maxWeight;
	}
	
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
			adjacency[i][j] = aco.randomZeroOne(p) * aco.randomInt(maxWeight);
		}
		
		if (_.max(adjacency[i]) == 0)
		{
			var oneAt = aco.randomInt(n - i - 1) + i;
			adjacency[i][oneAt] = aco.randomInt(maxWeight);
		}
	}
	
	adjacency = aco.adjacencyReverse(adjacency);
	
	return adjacency;
}

aco.adjacencyReverse = function(adjacency)
{
	var n = adjacency.length;
	for(var i = 0; i < n; i++)
	{
		for(var j = i+1; j < n; j++)
		{
			adjacency[j][i] = adjacency[i][j]; 
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
	var r = Math.random();
	if(r > 0.85)
	{
		return max;
	}
	return Math.floor(r * max) + 1;
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