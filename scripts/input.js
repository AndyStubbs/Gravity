var mouseX = 0;
var mouseY = 0;
var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;
var leftButton = false;
var noMovementCount = 0;
var zoomTimer;
var selectedObject = null;
var zoom = 25;

function MouseDown(e)
{
	mouseDown = true;
	leftButton = DetectLeftButton(e);
	HideAll();
	noMovementCount = 0;
	zoomTimer = setTimeout(CheckForZoom, 100);
}

function CheckForZoom()
{
	if(noMovementCount > 3)
	{

		camera.Update(0, 0, -1, false);
		
		if(paused)
			Draw();
		GetCameraData();
	}
	noMovementCount++;
	
	if(mouseDown)
		setTimeout(CheckForZoom, 100);	
}

function MouseUp(e)
{
	mouseDown = false;
	leftButton = DetectLeftButton(e);
	UnHideAll();
	clearTimeout(zoomTimer);
}

function HideAll()
{
	document.getElementById("div_camera").style.display = "none";
	document.getElementById("div_stats").style.display = "none";
}

function UnHideAll()
{
	document.getElementById("div_camera").style.display = "block";
	document.getElementById("div_stats").style.display = "block";
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

function TimePlayPause(button)
{
	if(paused)
		button.value = "||";
	else
		button.value = ">";
		
	paused = !paused;
}

function TimeSlowDown(button)
{
	dtMult--;
	if(dtMult < 1)
	{
		dtMult = 1;
		paused = true;
		document.getElementById("btn_PlayPause").value = ">";
	}
	dt = baseDt * dtMult;
	UpdateSpanSpeed()
}

function TimeSpeedUp(button)
{
	dtMult++;
	dt = baseDt * dtMult;
	UpdateSpanSpeed();
}

function TimeUpdate()
{
	dtMult = GetValue("txt_speed", dtMult);
	dt = baseDt * dtMult;
	UpdateSpanSpeed();
}

function UpdateSpanSpeed()
{
	document.getElementById("txt_speed").value = dtMult;
}

function GetCameraData()
{
	document.getElementById("camX").value = camera.position[0];
	document.getElementById("camY").value = camera.position[1];
	document.getElementById("camZ").value = camera.position[2];
	document.getElementById("camYaw").value = camera.yaw;
	document.getElementById("camPitch").value = camera.pitch;
	document.getElementById("camZoom").value = camera.zoom;
	document.getElementById("camHeight").value = camera.h;
	document.getElementById("camAngle").value = camera.angle;
}

function UpdateCameraFree()
{		
	camera.position[0] = GetValue("camX", camera.position[0]);
	camera.position[1] = GetValue("camY", camera.position[1]);
	camera.position[2] = GetValue("camZ", camera.position[2]);
	camera.yaw = GetValue("camYaw", camera.yaw);
	camera.pitch = GetValue("camPitch", camera.pitch);
	camera.Update(0, 0, 0);
	if(paused)
		Draw();
}

function UpdateCameraLookAt()
{
	var zoom = GetValue("camZoom", camera.zoom);
	if(zoom > camera.targetRadius * 2)
		camera.zoom = zoom;
	else
		camera.zoom = camera.targetRadius * 2;
	camera.h = GetValue("camHeight", camera.h);
	var angle = GetValue("camAngle", camera.angle);
	if(angle > Math.PI * 2)
	{
    	camera.angle = angle % (Math.PI * 2);
		document.getElementById("camAngle").value = camera.angle;
	}


	camera.Update(0, 0, 0);
	if(paused)
		Draw();
		
	GetCameraData();
}

function GetValue(elementName, value)
{
	var newValue = parseFloat(document.getElementById(elementName).value);
	if(!isNaN(newValue))
		return newValue;
	else
		return value;
}

function GetCameraType()
{
	var list = document.getElementById("sel_cameraType");
	var cameraType = list.options[list.selectedIndex].text;
	if(cameraType == "Free")
	{
		camera.SetFreeMode();
		document.getElementById("div_free_cam").style.display="block";
		document.getElementById("div_lookat_cam").style.display="none";
	}
	else
	{
		SelectCameraTarget();		
		document.getElementById("div_lookat_cam").style.display="block";
		document.getElementById("div_free_cam").style.display="none";
	}
}

function SelectCameraTarget()
{
	var targets = GetTargets();
	if(targets.length > 0)
	{
		camera.SetLookAtMode(targets, targets[0].radius);
		document.getElementById("div_lookat_cam").style.display="block";
		document.getElementById("div_free_cam").style.display="none";
		document.getElementById("sel_cameraType").options[1].selected = false;
		document.getElementById("sel_cameraType").options[0].selected = true;
		
		camera.Update(0, 0, 0);
		if(paused)
			Draw();
	}
}

function InitializeSelObjects()
{
	var list = document.getElementById("sel_objects");
	list.options.length = 0;
	//for(var i = planets.length - 1; i >= 0; i--)
	for(var i = 0; i < planets.length; i += 1)
	{
		var option=document.createElement("option");
		option.text = planets[i].name;
		list.options.add(option, null);
		planets[i].index = i;
	}
	
	if(list.options.length > 0)
		list.options[0].selected = true;
}

function GetTargets()
{
	var selectedPlanets = [];
	var list = document.getElementById("sel_objects");
	if(list.options.length > 0)
	{
		for(var i = 0; i < list.options.length; i++)
		{
			if(list.options[i].selected)
			{
				selectedPlanets.push(planets[i]);
			}
		}
		
		//If nothing is selected then select the first one
		if(selectedPlanets.length == 0)
		{
			list.options[0].selected = true;
			selectedPlanets.push(planets[0]);
		}
	}
	return selectedPlanets;
}

function SelectObject()
{
	var target = GetTargets()[0];
	selectedObject = target;
	PopulateObjectData();
}

function PopulateObjectData()
{
	if(selectedObject != null)
	{
		var target = selectedObject;
		document.getElementById("objX").value = UnScaleDistance(target.position[0]);
		document.getElementById("objY").value = UnScaleDistance(target.position[1]);
		document.getElementById("objZ").value = UnScaleDistance(target.position[2]);
		document.getElementById("objVX").value = UnScaleDistance(target.motion[0]);
		document.getElementById("objVY").value = UnScaleDistance(target.motion[1]);
		document.getElementById("objVZ").value = UnScaleDistance(target.motion[2]);
		document.getElementById("objMass").value = UnScaleMass(target.mass);
		document.getElementById("objRadius").value = UnScaleDistance(target.radius);
		document.getElementById("spanSelectedObject").innerHTML = target.name;

		SetReadableValues();
	}
}

function SetReadableValues()
{
	var objX = parseFloat(document.getElementById("objX").value);
    var objY = parseFloat(document.getElementById("objY").value);
	var objZ = parseFloat(document.getElementById("objZ").value);
	var objVX = parseFloat(document.getElementById("objVX").value);
	var objVY = parseFloat(document.getElementById("objVY").value);
	var objVZ = parseFloat(document.getElementById("objVZ").value);
	var objMass = parseFloat(document.getElementById("objMass").value);
	var objRadius = parseFloat(document.getElementById("objRadius").value);

	if(objX > 999999)
		document.getElementById("objX").value = objX.toExponential(1);
	else
		document.getElementById("objX").value = objX.toFixed(6);

	if(objY > 999999)
		document.getElementById("objY").value = objY.toExponential(1);
	else
		document.getElementById("objY").value = objY.toFixed(6);

	if(objZ > 999999)
		document.getElementById("objZ").value = objZ.toExponential(1);
	else
		document.getElementById("objZ").value = objZ.toFixed(6);

	if(objVX > 999999)
		document.getElementById("objVX").value = objVX.toExponential(1);
	else
		document.getElementById("objVX").value = objVX.toFixed(6);

	if(objVY > 999999)
		document.getElementById("objVY").value = objVY.toExponential(1);
	else
		document.getElementById("objVY").value = objVY.toFixed(6);

	if(objVZ > 999999)
		document.getElementById("objVZ").value = objVZ.toExponential(1);
	else
		document.getElementById("objVZ").value = objVZ.toFixed(6);

	if(objMass > 999999)
		document.getElementById("objMass").value = objMass.toExponential(1);
	else
		document.getElementById("objMass").value = objMass.toFixed(6);

	if(objRadius > 999999)
		document.getElementById("objRadius").value = objRadius.toExponential(1);
	else
		document.getElementById("objRadius").value = objRadius.toFixed(6);
}

function UpdateTarget(isTextured)
{
	if(selectedObject != null)
	{
		var target = selectedObject;
		target.position[0] = ScaleDistance(GetValue("objX", UnScaleDistance(target.position[0])));
		target.position[1] = ScaleDistance(GetValue("objY", UnScaleDistance(target.position[1])));
		target.position[2] = ScaleDistance(GetValue("objZ", UnScaleDistance(target.position[2])));
		target.motion[0] = ScaleDistance(GetValue("objVX", UnScaleDistance(target.motion[0])));
		target.motion[1] = ScaleDistance(GetValue("objVY", UnScaleDistance(target.motion[1])));
		target.motion[2] = ScaleDistance(GetValue("objVZ", UnScaleDistance(target.motion[2])));
		target.mass = ScaleMass(GetValue("objMass", UnScaleMass(target.mass)));
		var oldRadius = target.radius;
		var newRadius = ScaleDistance(GetValue("objRadius", UnScaleDistance(target.radius)));
		var diff = Math.abs((oldRadius - newRadius)/((oldRadius + newRadius)/2));

		if(diff > .1)
		{
			target.radius = newRadius;
			if(isTextured)
				target.model = CreateSphereTextured(target.radius, target.model.texture);
			else
				target.model = CreateSphere(target.radius, target.color, 4);
			camera.targetRadius = newRadius;
		}

		camera.Update(0, 0, 0);
		if(paused)
			Draw();

		PopulateObjectData();
	}
}

function CreateNewObject()
{
	var objX = ScaleDistance(GetValue("objX", 0));
	var objY = ScaleDistance(GetValue("objY", 0));
	var objZ = ScaleDistance(GetValue("objZ", 0));
	var objVX = ScaleDistance(GetValue("objVX", 0));
	var objVY = ScaleDistance(GetValue("objVY", 0));
	var objVZ = ScaleDistance(GetValue("objVZ", 0));
	var mass = ScaleMass(GetValue("objMass", UnScaleMass(1)));
	var radius = ScaleDistance(GetValue("objRadius", UnScaleDistance(1)));
	var color = [Math.random(), Math.random(), Math.random(), .5];
	var planet = CreatePlanetObject(radius, mass, color);
	planet.name = "Planet" + planets.length;
	planet.position[0] = objX;
	planet.position[1] = objY;
	planet.position[2] = objZ;
	planet.motion[0] = objVX;
	planet.motion[1] = objVY;
	planet.motion[2] = objVZ;
	planet.radius = radius;
	planet.mass = mass;
	planets.push(planet);
	InitializeSelObjects();
	camera.Update(0, 0, 0);
	if(paused)
		Draw();
}

var createObjectTexturedImage = false;
function CreateNewObjectTextured()
{
	if(!createObjectTexturedImage)
	{
		createObjectTexturedImage = new Image();
		createObjectTexturedImage.onload = CreateNewObjectTextured2;
		createObjectTexturedImage.src = "img/" +
			randomImages[Math.round(Math.random() * (randomImages.length - 1))];
	}
}

function CreateNewObjectTextured2()
{
	var objX = ScaleDistance(GetValue("objX", 0));
	var objY = ScaleDistance(GetValue("objY", 0));
	var objZ = ScaleDistance(GetValue("objZ", 0));
	var objVX = ScaleDistance(GetValue("objVX", 0));
	var objVY = ScaleDistance(GetValue("objVY", 0));
	var objVZ = ScaleDistance(GetValue("objVZ", 0));
	var mass = ScaleMass(GetValue("objMass", UnScaleMass(1)));
	var radius = ScaleDistance(GetValue("objRadius", UnScaleDistance(1)));
	var color = [Math.random(), Math.random(), Math.random(), .5];
	var planet = CreatePlanetObjectTextured(radius, mass, color, createObjectTexturedImage);
	planet.name = "Planet" + planets.length;
	planet.position[0] = objX;
	planet.position[1] = objY;
	planet.position[2] = objZ;
	planet.motion[0] = objVX;
	planet.motion[1] = objVY;
	planet.motion[2] = objVZ;
	planet.radius = radius;
	planet.mass = mass;
	planets.push(planet);
	InitializeSelObjects();
	camera.Update(0, 0, 0);
	if(paused)
		Draw();
	createObjectTexturedImage = false;
}

function ClearValues()
{
	document.getElementById("objX").value = 0;
	document.getElementById("objY").value = 0;
	document.getElementById("objZ").value = 0;
	document.getElementById("objVX").value = 0;
	document.getElementById("objVY").value = 0;
	document.getElementById("objVZ").value = 0;
	document.getElementById("objMass").value = UnScaleMass(1);
	document.getElementById("objRadius").value = UnScaleDistance(1);

	SetReadableValues();
}

function ToggleSettings()
{
	var btn = document.getElementById("btnShowHideSettings");
	if(btn.value == "Hide Settings")
	{
		btn.value = "Show Settings";
		document.getElementById("div_settings").style.display = "none";
	}
	else
	{
		btn.value = "Hide Settings";
		document.getElementById("div_settings").style.display = "block";
	}
}

function UpdateG()
{
	G = ScaleG(GetValue("txtG", UnScaleG(6.67384E-11)));
	document.getElementById("txtG").value = UnScaleG(G);
}

function ShowOrbit()
{
	var targets = GetTargets();
	for(var t = 0; t < targets.length; t++)
	{
		var vertices = [];
		var cm = {};
		cm.index = targets[t].index;
		cm.position = vec3.create();
		
		cm.position[0] = targets[t].position[0];
		cm.position[1] = targets[t].position[1];
		cm.position[2] = targets[t].position[2];		
		var startX = cm.position[0];
		var startY = cm.position[1];
		var startZ = cm.position[2];
		cm.motion = vec3.create();
		cm.motion[0] = targets[t].motion[0];
		cm.motion[1] = targets[t].motion[1];
		cm.motion[2] = targets[t].motion[2];
		cm.radius = targets[t].radius;
		var max = orbitMax;
		var maxDt = orbitMaxDt;
		var count = 0;
		var tempDt = dt;
		var step = 0;
		var lastR = 0;
		var abort = false;
		var countStart = 0;

		count = max;
		while(count == max && tempDt < maxDt && !abort)
		{
			count = countStart;
			while(count < max && step < 2 && !abort)
			{
			
				movePlanet(cm, t, tempDt, cm.index);
				
				//Check if moving away from origin
				var rx = startX - cm.position[0];
				var ry = startY - cm.position[1];
				var rz = startZ - cm.position[2];
				var r = Math.sqrt(rx * rx + ry * ry + rz * rz);	
				
				//If object is not moving abort orbit calculation
				if(r == lastR)
					abort = true;
					
				//Step 0 object is moving away from origin
				//Ends when origin is moving closer
				if(step == 0)
				{
					if(r < lastR)
						step++;
				}
				
				//Step 1 object is moving closer to origin
				//Ends when object is moving away from origin
				if(step == 1)
				{
					if(r > lastR)
						step++;
				}
				
				//Update the vertex
				vertices[count * 3] = cm.position[0];
				vertices[count * 3 + 1] = cm.position[1];
				vertices[count * 3 + 2] = cm.position[2];
				
				lastR = r;
				count++;
			}
//			if(count == max)
//			{
//				//Cut the number of steps in half
//				tempDt *= 2;	
//				tempVertices = [];
//				/*for(var i = 0; i < (count + 1) / 2; i++)
//				{
//					tempVertices[i * 3] = vertices[i*2*3];
//					tempVertices[i * 3 + 1] = vertices[i*2*3 + 1];
//					tempVertices[i * 3 + 2] = vertices[i*2*3 + 2];
//				}*/
//				for(var i = 0; i < count; i+=2)
//				{
//					tempVertices.push(vertices[i*3]);
//					tempVertices.push(vertices[i*3+1]);
//					tempVertices.push(vertices[i*3+2]);
//				}
//				vertices = tempVertices;
//				countStart = i / 2;
			//			}
			if (count == max) 
			{
				vertices = [];
				cm.position = vec3.create();
				cm.position[0] = targets[t].position[0];
				cm.position[1] = targets[t].position[1];
				cm.position[2] = targets[t].position[2];
				cm.motion = vec3.create();
				cm.motion[0] = targets[t].motion[0];
				cm.motion[1] = targets[t].motion[1];
				cm.motion[2] = targets[t].motion[2];
				step = 0;
				countStart = 0;
				tempDt *= 2;
				lastR = 0;
			}
		}

		if(vertices.length > 3)
		{
			orbits.push(CreateOrbit(targets[t].color, vertices));
		}
	}
	
	if(paused)
		Draw();
}

function ClearOrbits()
{
	orbits = [];
	if(paused)
		Draw();
}

function ShowTrails()
{
	var targets = GetTargets();
	for(var i = 0; i < targets.length; i++)
	{
		targets[i].UpdateTrail = UpdateTrail;
	}
}

function ClearTrails()
{
	var targets = GetTargets();
	for(var i = 0; i < targets.length; i++)
	{
		targets[i].UpdateTrail = function () {};
		targets[i].trail = [];
		targets[i].trailModel = false;
	}
	if(paused)
		Draw();
}

function SetObjectOrbit()
{
	if(selectedObject != null)
	{
		selectedObject.motion[0] = 0;
		selectedObject.motion[1] = 0;
		selectedObject.motion[2] = 0;
			
		var targets = GetTargets();
		SetOrbit(selectedObject, targets);
		
		PopulateObjectData();
	}	
}

//Toggles Velocity Vectors on all selected objects
function ShowVectors()
{
	var targets = GetTargets();
	for(var i = 0; i < targets.length; i++)
	{
		if(targets[i].DrawVector == DrawVector)
		{
			targets[i].DrawVector = function(){};
		}
		else
		{
			targets[i].DrawVector = DrawVector;
		}
	}
	if(paused)
		Draw();
}

function Explode()
{
	var targets = GetTargets();
	
	deletePlanets = [];
	for(var tar = 0; tar < targets.length; tar++)
	{
		ExplodePlanet(targets[tar]);
		//(location, force, radius)
		
	}
	
	for(var i = deletePlanets.length - 1; i >= 0; i--)	
	{
		explosions.push({ 
			center: planets[deletePlanets[i]].position, 
			force: planets[deletePlanets[i]].mass * forcePush,
			forceOrig: planets[deletePlanets[i]].mass * forcePush,
			radius: planets[deletePlanets[i]].radius,
			speed: planets[deletePlanets[i]].radius * forceDispersion,
			oldRadius: 0
		});
		planets.splice(deletePlanets[i], 1);
		InitializeSelObjects();
	}
		
	if(paused)
		Draw();
}

function ToggleFieldset(id, check)
{
	var fieldset = document.getElementById(id);
	if(check.checked)
		fieldset.style.display = "block";
	else
		fieldset.style.display = "none";
}

var lastTime = 0;
var fps = 0;
var frames = 0;
function DisplayFPS()
{
	var d = new Date();
	var _t = d.getTime();

	frames++;
	if(_t - lastTime > 1000)
	{
		fps = Math.round( (frames / ((_t - lastTime) / 1000)) * 100) / 100;
		lastTime = _t;
		frames = 0;
	}
	var date = new Date(t);
	var year=date.getFullYear();
	var month=date.getMonth() + 1;
	var day = date.getDate();
	var hour=date.getHours();
	var minute=date.getMinutes();
	var seconds=date.getSeconds();
	var milliSeconds = date.getMilliseconds();

	div_stats = document.getElementById("div_stats");
	div_stats.innerHTML = "FPS: " + fps + "<br />";
	div_stats.innerHTML += fixed(month.toString(), 2) + "/" + fixed(day.toString(), 2) +
		"/" + year + " " + fixed(hour.toString(), 2) + ":" + fixed(minute.toString(), 2) +
		":" + fixed(seconds.toString(), 2) + ":" + fixed(milliSeconds.toString(), 3) +
		"<br />";
	var proper_time = (dt * fps);

	var strTime = "";
	if (proper_time < 60)
		strTime = "dt: " + proper_time.toFixed(8) + " secs";
	else if (proper_time < 3600)
		strTime = "dt: " + (proper_time / 60).toFixed(8) + " mins";
	else if (proper_time < 86400)
		strTime = "dt: " + (proper_time / 3600).toFixed(8) + " hours";
	else if (proper_time < 31471200)
		strTime = "dt: " + (proper_time / 86400).toFixed(8) + " days";
	else
		strTime = "dt: " + (proper_time / 31471200).toFixed(8) + " years";

	div_stats.innerHTML += strTime;
}

function fixed(str, length)
{
	while(str.length < length)
		str = "0" + str;

	return str;
}

function DisplayCalculations()
{
	document.getElementById("div_stats").innerHTML += "<br />Force Calculations: " + calculations;
}

function ToggleGrid() 
{

	if (document.getElementById("btnToggleGrid").value == "Show Grid") 
	{
		//Grab the dimensions for the grid
		var xMax = 0;
		var zMax = 0;
		var xMin = 0;
		var zMin = 0;

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i];
			if (planet.position[0] > xMax)
				xMax = planet.position[0];
			if (planet.position[2] > zMax)
				zMax = planet.position[2];
			if (planet.position[0] < xMin)
				xMin = planet.position[0];
			if (planet.position[2] < zMin)
				zMin = planet.position[2];
		}

		//Even out the grid
		if (Math.abs(xMax) > Math.abs(xMin))
			xMin = xMax - xMax * 2;
		else
			xMax = Math.abs(xMin);

		if (Math.abs(zMax) > Math.abs(zMin))
			zMin = zMax - zMax * 2;
		else
			zMax = Math.abs(zMin);

		if (xMax > zMax)
			zMax = xMax;
		else
			xMax = zMax;

		if (xMin < zMin)
			zMin = xMin;
		else
			xMin = zMin;

		var vertices = [];
		var color_data = [];
		//Draw vertical rows
		var width = (xMax - xMin) / 100;
		for (var x = xMin; x < xMax; x += width) {
			vertices.push(x);			
			vertices.push(0);
			vertices.push(zMin);

			vertices.push(x);
			vertices.push(0);
			vertices.push(zMax);
		}

		//Draw Horizontal rows
		var height = (zMax - zMin) / 100;
		for (var z = zMin; z < zMax; z += height) {
			vertices.push(xMin);
			vertices.push(0);
			vertices.push(z);

			vertices.push(xMax);
			vertices.push(0);
			vertices.push(z);
		}

		color_data.push(.5);
		color_data.push(.5);
		color_data.push(.5);
		color_data.push(0);

		grid = CreateOrbit(color_data, vertices);
		document.getElementById("btnToggleGrid").value = "Hide Grid";
	}
	else 
	{
		grid = false;
		document.getElementById("btnToggleGrid").value = "Show Grid";
	}
}



var lastPlanetSize = "Normal";

function TogglePlanetSize(obj) 

{

	var sx = 1;

	var px = 1;



	switch(obj.value)

	{

		case "Normal":

			sx = 1;

			px = 1;

			break;

		case "1x/2x":

			sx = 1;

			px = 2;

			break;

		case "2x/20x":

			sx = 2;

			px = 20;

			break;

		case "5x/50x":

			sx = 5;

			px = 50;

			break;

		case "10x/100x":

			sx = 10;

			px = 100;

			break;		

		case "50x/500x":

			sx = 50;

			px = 500;

			break;

		case "100x/1000x":

			sx = 100;

			px = 1000;

			break;

		case "200x/5000x":

			sx = 200;

			px = 5000;

			break;

	}



	if (obj.value != lastPlanetSize)

	{

		planets[0].model = CreateSphereTextured(planets[0].radius * sx, planets[0].model.texture);



		for (var i = 1; i < planets.length; i++) {

			planets[i].model = CreateSphereTextured(planets[i].radius * px, planets[i].model.texture);

		}

	}

	lastPlanetSize = obj.value;

}











