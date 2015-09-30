var dt = 0.125;
var baseDt = 0.125;
var dtMult = 1;
var t = 0;
var ticks = 0;
var planets = [];
var stars = [];
var points = {};
var explosions = [];
var deleteExplosions = [];

points.vertices = [];
points.motion = [];
points.colors = [];

var G = 0.1;
var friction = 0.5;
var delay = 17;
var wall;
var camera;
var paused = false;

var calculations = 0;
function Run()
{	
	if(!paused)
	{
		calculations = 0;
		canvas.width = canvas.width;	
		//MovePlanetsWithCollisions();		
		//MovePlanetsWithIntegrationNoCollisions();
		MovePlanetsWithIntegrationAndCollisions();
		//MovePlanetsWithIntegrationAndCollisions2();
		ApplyExplosions();
		Draw();
		t += dt * 1000;
		ticks++;
	}
	DisplayFPS();
	DisplayCalculations();
	
	setTimeout(Run, delay);
}

var lastTime = 0;
var fps = 0;
var frames = 0;
function DisplayFPS()
{
	var d = new Date();
	var t = d.getTime();
	
	frames++;
	if(t - lastTime > 1000)
	{
		fps = Math.round( (frames / ((t - lastTime) / 1000)) * 100) / 100;
		lastTime = t;
		frames = 0;
	}
	document.getElementById("div_stats").innerHTML = "FPS: " + fps;
}

function DisplayCalculations()
{
	document.getElementById("div_stats").innerHTML += "<br />Calculations: " + calculations;
}
