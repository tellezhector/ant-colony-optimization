presentation = {};
presentation.button_slide_3 = function(button)
{
	var button = $(button);
	var parent = button.parent();
	button.remove();
	parent.append("¡Como en problemas de teoría de gráficas!");
	parent.append('<button id="button_s3" onclick="presentation.button_slide_3_1(this)">Click!</button>');
	parent.append('<div id="canvas1"></div>');
	aco.draw(aco.randomGraph(50, 0.03), '#canvas1');
}

presentation.button_slide_3_1 = function(button)
{
	aco.draw(aco.randomGraph(50, 0.02), '#canvas1');
}

presentation.button_slide_10 = function(button)
{
	var button = $(button);
	var quitaeso = $("#quitaeso");
	if(quitaeso.length == 0)
	{
		button.after('<button id="quitaeso" onclick="presentation.button_slide_10_1(this)">Quíta eso!</button>');
	}
	
	var parent = button.parent();
	parent.append('<div id="canvas2"></div>');
	aco.draw(aco.randomGraph(20, 1), '#canvas2');
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
	
	parent.append('<div id="canvas3"></div>');
	presentation.graph = aco.randomGraph(7, 1);
	aco.draw(presentation.graph, '#canvas3');
}

presentation.slide_15_insert_buttons = function(button)
{
	if(button.text() == "Another")
	{
		return;
	}
	
	button
		.after('<button onclick="presentation.train_a_lot()">Train me a lot! (this will take a time)</button>')		
		.after('<button onclick="presentation.send_a_tousend_ants()">Send a tousend ants</button>')
		.after('<button onclick="presentation.update_trail()">Update trail</button>')	
		.after('<button onclick="presentation.send_an_ant()">Send an ant</button>')
		.after('<button onclick="presentation.button_slide_15(this)">Another</button>');
	button.remove();
}

presentation.train_a_lot = function()
{
	for(var i = 0; i < 1000; i++)
	{
		presentation.send_a_tousend_ants();
		presentation.update_trail();
	}
}

presentation.send_a_tousend_ants = function()
{
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
	presentation.graph.pathLengths.push(aco.pathLength(presentation.graph, path));
}

presentation.update_trail = function()
{
	aco.updateTrail(presentation.graph);
}

presentation.clap = function(button)
{
	var button = $(button);
	button.after('<img src="images/meee.gif" />').after("<br><br>");
}
