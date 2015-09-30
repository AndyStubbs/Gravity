function MouseDown(e)
{
	mouseDown = true;
	leftButton = DetectLeftButton(e);
}

function MouseUp(e)
{
	mouseDown = false;
	leftButton = DetectLeftButton(e);
}

function DetectLeftButton(e)
{
    if ('which' in e)
    {
        return e.which === 1;
    }
    else if ('buttons' in e)
    {
        return e.buttons === 1;
    }
    else
    {
        return e.button === 1;
    }
}

function MouseMove(e)
{
	if(e.offsetX)
	{
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if(e.layerX)
	{
		mouseX = e.layerX;
		mouseY = e.layerY;
	}

	if(mouseDown)
	{
		if(mouseX != lastMouseX || mouseY != lastMouseY)
		{
			noMovementCount = 0;
			var xMove = mouseX - lastMouseX;
			var yMove = mouseY - lastMouseY;

			camera.Update(xMove, yMove, 0, leftButton);
			if(paused)
				Draw();
		}
	}

	lastMouseX = mouseX;
	lastMouseY = mouseY;
	GetCameraData();
}

function MouseWheel(event)
{
	var delta = 0;

	if (!event)
		event = window.event;

	if (event.wheelDelta)
	{
		delta = event.wheelDelta/120;
	}
	else if (event.detail)
	{
		delta = -event.detail/3;
	}

	camera.Update(0, 0, -delta, false);
    if(paused)
		Draw();

	if (event.preventDefault)
		event.preventDefault();

	event.returnValue = false;
	GetCameraData();
}

function KeyDown(event)
{
	//alert(event.keyCode);
	//37 & 100 - left
	//38 & 104 - up
	//39 & 102 - right
	//40 & 98 - down
	//32 space - fire engine #1 - low power
	//13 enter - fire engine #2 - high power
	//36 & 103 Num 7 - roll counterclockwise
	//33 & 105 Num 9 - roll clockwise
	//12 & 101 Num 5 - neutralize rotation
	//71 g - grid toggle
	//86 v - show accelaration and velocity vectors
	switch(event.keyCode)
	{
		case 37:
		case 100:
			ships[0]
			break;
	}
}
