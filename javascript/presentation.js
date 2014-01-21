presentation = {};
presentation.button_slide_3 = function(button)
{
	var button = $(button);
	var parent = button.parent();
	button.remove();
	parent.append("¡Como en problemas de teoría de gráficas!");
	parent.append('<button id="button_s3" onclick="presentation.button_slide_3_1(this)">Click!</button>');
	parent.append('<div id="canvas1"></div>');
	presentation.button_slide_3_1();
}

presentation.button_slide_3_1 = function(button)
{
	var graph = aco.randomGraph(50, 0.02, { maxWeight : 1 });
	aco.draw(graph, '#canvas1');
}

presentation.button_slide_10 = function(button)
{
	var button = $(button);
	var quitaeso = $("#quitaeso");
	if(quitaeso.length == 0)
	{
		button.after('<button id="quitaeso" onclick="presentation.button_slide_10_1(this)">Get rid of it!</button>');
	}
	
	var parent = button.parent();
	parent.append('<div id="canvas2"></div>');
	aco.draw(aco.randomGraph(20, 1, { maxWeight : 1 }), '#canvas2');
}

presentation.button_slide_10_1 = function(button)
{
	$("#canvas2").remove();
}

presentation.button_slide_15 = function(button)
{
	var button = $(button);
	var parent = button.parent();
	presentation.slide_15_insert_buttons(button);
	presentation.graph = aco.randomGraph(8, 1);
	aco.draw(presentation.graph, '#canvas3');
}

presentation.show_weight = function(weight)
{
	$("#weight").html("peso: " + weight);
}

presentation.errase_wegith = function()
{
	$("#weight").html("");
}

presentation.muestra_problema_del_agente_viajero = function(button)
{
	var button = $(button);
	button.next().show();
	button.remove();
	presentation.traveling_salesman_example_graph = aco.randomGraph(8, 1);	
	aco.draw(presentation.traveling_salesman_example_graph, "#canvas_traveling_salesman_problem");
}

presentation.colorea_problema_del_agente_viajero = function(button)
{
    if (typeof presentation.traveling_salesman_example_graph !== "undefined")
	{
		aco.resetLinksColor(presentation.traveling_salesman_example_graph);
	}
	
	var path = aco.getPath(presentation.traveling_salesman_example_graph);
    aco.colorPath(presentation.traveling_salesman_example_graph, path, "#canvas_traveling_salesman_problem");
}

presentation.slide_15_insert_buttons = function(button)
{
	if(button.text() == "Another")
	{
		return;
	}
	
	button
		.after('<button onclick="presentation.train_a_lot()">Train me a lot! (this will take a while)</button>')		
		.after('<button onclick="presentation.send_a_thousend_ants()">Send a thousend ants</button>')
		.after('<button onclick="presentation.update_trail()">Update trail</button>')	
		.after('<button onclick="presentation.send_an_ant()">Send an ant</button>')
		.after('<button onclick="presentation.button_slide_15(this)">Another</button>');
	button.remove();
}

presentation.train_a_lot = function()
{
    presentation.errase_wegith();
	for(var i = 0; i < 1000; i++)
	{
		console.log(i);
		presentation.send_a_thousend_ants();
		presentation.update_trail();
	}
}

presentation.send_a_thousend_ants = function()
{
    presentation.errase_wegith();
	for(var i=0; i < 1000; i++)
	{
		var path = aco.getPath(presentation.graph);
		presentation.graph.paths.push(path);
		presentation.graph.pathLengths.push(aco.pathLength(presentation.graph, path));
	}
}

presentation.send_an_ant = function()
{
	aco.resetLinksColor(presentation.graph);
	var path = aco.getPath(presentation.graph);
	aco.colorPath(presentation.graph, path, "#canvas3");
	presentation.graph.paths.push(path);
	var length = aco.pathLength(presentation.graph, path);
	presentation.graph.pathLengths.push(length);
	presentation.show_weight(length);
}

presentation.update_trail = function()
{
	aco.updateTrail(presentation.graph);
}
presentation.clap = function(button)
{
	var button = $(button);
	var bellow = button.next();
	button.remove();
	for (var i=0; i < 24; i++)
	{
		setTimeout(function(){presentation.addBeaker(bellow)}, i*500);
	}
}

presentation.addBeaker = function(bellow)
{
	bellow.after('<div style="float: left; width: 25%" ><img src="images/meee.gif" style="width: 100%" class="reflect" alt="Description" title="Description"/></div>');
}