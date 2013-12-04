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