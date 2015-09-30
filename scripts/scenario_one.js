function InitSolarSystem()
{
	camera.position[2] = 40;
	camera.position[1] = 0;
	camera.position[0] = 0;
	planets = [];
	stars = [];
	
	//Sun
	var color = [.8, .4 , 0, .25];
	
	var planet = CreatePlanetObject(5, 180, color);
	planet.position[0] = 0;
	planet.name = "Sun";
	planets.push(planet);
	
	//Planet
	for(var i = 0; i < 5; i++)
	{
		var color2 = [Math.random(), Math.random(), Math.random(), .5];
		var planet2 = CreatePlanetObject(.5, 1, color2);
		planet2.position[0] = Math.random() * 40 - 20;
		planet2.position[1] = Math.random() * 40 - 20;
		planet2.position[2] = Math.random() * 40 - 20;
		planet2.name = "Planet" + i;
		SetOrbit(planet2, [planet]);
		//planet2.motion[1] = Math.random() * -1;		
		
		planets.push(planet2);
	}
	
	/*for(var i = 0; i < 50; i ++)
	{
		var color2 = [Math.random(), Math.random(), Math.random(), .5];
		var star = CreateObject(.1, .1, color2);
		star.position[0] = Math.random() * 40 - 20;
		star.position[1] = Math.random() * 40 - 20;
		star.position[2] = Math.random() * 40 - 20;
		//planet2.motion[1] = Math.random() * -1;		
		
		stars.push(star);
	}*/
	
	//points = CreatePoints([.5, .5, .5, .25], 100000);
	/*
	var count = 10000;
	var vertices = [];
	var colors = [];
	var motion = [];
	var vx = 1;
	for(var i = 0; i < count / 3; i++)
	{		
		var r = 2;
		var a1 = Math.random() * Math.PI * 2;
		var a2 = Math.random() * Math.PI * 2;
		var x = Math.sin(a1)*Math.cos(a2) * r;
		var y = Math.sin(a1)*Math.sin(a2) * r;
		var z = Math.cos(a1) * r - 20;
		
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		
		motion.push(vx);
		motion.push(0);
		motion.push(0);
		
		colors.push((x - 4) / 8);
		colors.push((y + 4) / 8);
		colors.push(.5);
		colors.push(1.0);
	}
	*/
	/*
	for(var i = 0; i < count / 3; i++)
	{
	
		var r = 2;
		var a1 = Math.random() * Math.PI * 2;
		var a2 = Math.random() * Math.PI * 2;
		var x = Math.sin(a1)*Math.cos(a2) * r;
		var y = Math.sin(a1)*Math.sin(a2) * r;
		var z = Math.cos(a1) * r - 21;
		
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		
		motion.push(vx);
		motion.push(0);
		motion.push(0);
		
		colors.push(0.5);
		colors.push((y - 4) / 8);
		colors.push((x - 24) / 8);
		colors.push(1.0);
	}
	
	for(var i = 0; i < count / 3; i++)
	{
		var r = 2;
		var a1 = Math.random() * Math.PI * 2;
		var a2 = Math.random() * Math.PI * 2;
		var x = Math.sin(a1)*Math.cos(a2) * r;
		var y = Math.sin(a1)*Math.sin(a2) * r;
		var z = Math.cos(a1) * r - 2;
		
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		
		motion.push(vx);
		motion.push(0);
		motion.push(0);
		
		colors.push((x - 20) / 40);
		colors.push(.5);
		colors.push((y + 20) / 40);
		colors.push(1.0);
	}
	*/
	
	//points = CreatePoints(vertices, colors);
	//points.motion = motion;
	
	//var planet = CreatePlanet(2, 2, [.5, .5, .5, .5]);
	//planet.position[0] = 199;	
	//planet.motion[0] = -5;
	//planet.angularVelocity[1] = 0.15
	//planets.push(planet);
	
	/*
	var planet = CreatePlanet(5, 55, [.5, .5, .5, .5]);
	planet.position[0] = -100;
	planet.position[1] = -0;
	planet.motion[0] = .3;
	planets.push(planet);
	
	var planet = CreatePlanet(5, 55, [.5, .5, .5, .5]);
	planet.position[0] = -0;
	planet.position[1] = 0;
	planet.position[2] = -100;
	planet.motion[2] = .3;
	planets.push(planet);
	
	var planet = CreatePlanet(5, 55, [.5, .5, .5, .5]);
	planet.position[0] = 0;
	planet.position[1] = -0;
	planet.position[2] = 100;
	planet.motion[2] = -.3;
	planets.push(planet);

	
	var planet = CreatePlanet(5, 55, [.5, .5, .5, .5]);
	planet.position[0] = -0;
	planet.position[1] = 100;
	planet.position[2] = -0;
	planet.motion[1] = -.3;
	planets.push(planet);
	
	var planet = CreatePlanet(5, 55, [.5, .5, .5, .5]);
	planet.position[0] = 0;
	planet.position[1] = -100;
	planet.position[2] = 0;
	planet.motion[1] = .3;
	planets.push(planet);
*/
}