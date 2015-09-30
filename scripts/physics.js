var collisions = [];
var planets = [];
var stars = [];
var points = {};
var explosions = [];
var deleteExplosions = [];
var fakePoints = [];

fakePoints.vertices = [];
fakePoints.motion = [];
fakePoints.colors = [];

points.vertices = [];
points.motion = [];
points.colors = [];

function MovePlanetsWithOctTree()
{
	UpdateAccleration(planets);
	UpdateAcclerationParticles2();
	UpdateParticlePositions();
	UpdatePositions(dt);
}

function MovePlanetsNoCollisions()
{
	//Update planets accleration
	UpdateAcclerationOld(planets);
	UpdateAcclerationParticles();
	UpdatePositions(dt);
	UpdateParticlePositions();
}

function MovePlanetsWithCollisions()
{	
	//Update planets accleration
	UpdateAcclerationOld(planets);
	UpdateAcclerationParticles();
	
	var ellapsedTime = 0;
	while(ellapsedTime < dt)
	{
		var firstCollisions = FindFirstCollisions(dt - ellapsedTime);
		
		UpdatePositions(firstCollisions[0].time);
		if(firstCollisions[0].i > -1)
		{
			for(var j = 0; j < firstCollisions.length; j++)
			{
				if(firstCollisions[0].time < 0)
				{
					PlaceSmallerObjectOnRadius(planets[firstCollisions[j].i], planets[firstCollisions[j].j]);
				}
				CalculateCollisionResponse(firstCollisions[j]);
				CalculateCollisionSpin(planets[firstCollisions[j].i], planets[firstCollisions[j].j]);		
				CalculateCollisionSpin(planets[firstCollisions[j].j], planets[firstCollisions[j].i]);
			}
		}	
		
		if(firstCollisions[0].time > 0)
			ellapsedTime += firstCollisions[0].time;
		else
			ellapsedTime += 0.001;
	}
	
	UpdateParticlePositions();
}

function MovePlanetsWithIntegrationNoCollisions()
{
	for(var i = 0; i < planets.length; i++)
	{
		planets[i].acceleration = vec3.create();
		Integrate(planets[i], t, dt, i);
		planets[i].UpdateTrail();
	}
	UpdateAcclerationParticles();
	UpdateParticlePositions();
	//MoveParticlesWithIntegration();
}

function MovePlanetsWithIntegrationAndCollisions()
{
	collisions = [];
	for(var i = 0; i < planets.length; i++)
	{
		planets[i].acceleration = vec3.create();
		Integrate(planets[i], t, dt, i);		
		planets[i].UpdateTrail();
	}
	
	for(var i in collisions)
	{
		var planet1 = planets[collisions[i].i];
		var planet2 = planets[collisions[i].j];
		
		//Set angular velocities
		var vec_w = CalculateCollisionSpin(planet1, planet2);
		var vec_w = CalculateCollisionSpin(planet2, planet1);
				
		PlaceSmallerObjectOnRadius(planet1, planet2);
		
		//Calculate the new velocities
		CalculateCollisionResponse(collisions[i]);
	}
	
	UpdateRotation(dt);
	UpdateAcclerationParticles();
	UpdateParticlePositions();
}

function MovePlanetsWithIntegrationAndCollisions2()
{
	var ellapsedTime = 0;
	while(ellapsedTime < dt)
	{
		var firstCollisions = FindFirstCollisions(dt - ellapsedTime);		
		
		for(var i = 0; i < planets.length; i++)
		{
			planets[i].acceleration = vec3.create();
			Integrate(planets[i], t, dt - ellapsedTime, i);
			planets[i].UpdateTrail();
		}
		
		if(firstCollisions[0].i > -1)
		{
			for(var j = 0; j < firstCollisions.length; j++)
			{
				if(firstCollisions[0].time < 0)
				{
					PlaceSmallerObjectOnRadius(planets[firstCollisions[j].i], planets[firstCollisions[j].j]);
				}
				CalculateCollisionResponse(firstCollisions[j]);
				CalculateCollisionSpin(planets[firstCollisions[j].i], planets[firstCollisions[j].j]);		
				CalculateCollisionSpin(planets[firstCollisions[j].j], planets[firstCollisions[j].i]);
			}
		}	
		
		if(firstCollisions[0].time > 0)
			ellapsedTime += firstCollisions[0].time;
		else
			ellapsedTime += 0.001;
	}
	
	UpdateAcclerationParticles();
	UpdateParticlePositions();
	UpdateRotation(dt);
}

function PlaceSmallerObjectOnRadius(planet1, planet2)
{
	//Set position to the point of impact			
	var temp_r = vec3.create();
	temp_r[0] = planet2.position[0] - planet1.position[0];
	temp_r[1] = planet2.position[1] - planet1.position[1];
	temp_r[2] = planet2.position[2] - planet1.position[2];
	vec3.normalize(temp_r);		
	
	if(planet1.mass > planet2.mass)
	{
		planet2.position[0] = planet1.position[0] + temp_r[0] * (planet1.radius + planet2.radius);
		planet2.position[1] = planet1.position[1] + temp_r[1] * (planet1.radius + planet2.radius);
		planet2.position[2] = planet1.position[2] + temp_r[2] * (planet1.radius + planet2.radius);
	}
	else
	{
		planet1.position[0] = planet2.position[0] - temp_r[0] * (planet1.radius + planet2.radius);
		planet1.position[1] = planet2.position[1] - temp_r[1] * (planet1.radius + planet2.radius);
		planet1.position[2] = planet2.position[2] - temp_r[2] * (planet1.radius + planet2.radius);
	}
}

function CalculateAccleration(obj1, obj2, d, dx, dy, dz)
{
	calculations++;
	if(d > obj1.radius + obj2.radius)
	{
		var acceleration = (G * obj2.mass) / (d * d);
		
		obj1.acceleration[0] += dx * acceleration / d;
		obj1.acceleration[1] += dy * acceleration / d;
		obj1.acceleration[2] += dz * acceleration / d;		
	}
}

function UpdateRotation(time)
{
	for(var i = 0; i < planets.length; i++)
	{
		var planet = planets[i];
		
		//Update rotation
		planet.rotation[0] += planet.angularVelocity[0] * time;
		planet.rotation[1] += planet.angularVelocity[1] * time;
		planet.rotation[2] += planet.angularVelocity[2] * time;
	}
}

function UpdatePositions(time)
{
	for(var i = 0; i < planets.length; i++)
	{
		var planet = planets[i];
		
		//Update position
		planet.position[0] += planet.motion[0] * time;
		planet.position[1] += planet.motion[1] * time;
		planet.position[2] += planet.motion[2] * time;
		
		//Update rotation
		planet.rotation[0] += planet.angularVelocity[0] * time;
		planet.rotation[1] += planet.angularVelocity[1] * time;
		planet.rotation[2] += planet.angularVelocity[2] * time;
		
		//Update velocity
		planet.motion[0] += planet.acceleration[0] * time;
		planet.motion[1] += planet.acceleration[1] * time;
		planet.motion[2] += planet.acceleration[2] * time;
	}
}

function UpdatestarPositions()
{
	for(var i = 0; i < stars.length; i++)
	{
		var star = stars[i];
		
		//Update position
		star.position[0] += star.motion[0] * dt;
		star.position[1] += star.motion[1] * dt;
		star.position[2] += star.motion[2] * dt;
		
		//Update rotation
		star.rotation[0] += star.angularVelocity[0] * dt;
		star.rotation[1] += star.angularVelocity[1] * dt;
		star.rotation[2] += star.angularVelocity[2] * dt;
		
		//Update velocity
		star.motion[0] += star.acceleration[0] * dt;
		star.motion[1] += star.acceleration[1] * dt;
		star.motion[2] += star.acceleration[2] * dt;
	}
}

function UpdateParticlePositions()
{
	if (fakePoints.vertices.length > 0) 
	{
		for (var i = 0; i < fakePoints.vertices.length; i += 3) 
		{
			var index = i + 3 * i / 3;
			var planet = fakePoints.motion[index];
			var r = fakePoints.motion[index + 1];
			var a = fakePoints.motion[index + 2];
			var speed = fakePoints.motion[index + 3];
			var inclination = fakePoints.motion[index + 4];
			var yOffset = fakePoints.motion[index + 5];

			//Update the angle
			a += speed * dt;
			fakePoints.motion[index + 2] = a;

			fakePoints.vertices[i] = Math.cos(a) * r + planet.position[0];
			fakePoints.vertices[i + 1] = ((Math.cos(a) * r) / inclination) + yOffset + planet.position[1];
			//var y =					 ((Math.cos(a) * r) / inclination) + yOffset;
			fakePoints.vertices[i + 2] = Math.sin(a) * r + planet.position[2];
		}

		webgl.bindBuffer(webgl.ARRAY_BUFFER, fakePoints.vertexPositionBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(fakePoints.vertices), webgl.STATIC_DRAW);

		//webgl.bindBuffer(webgl.ARRAY_BUFFER, fakePoints.vertexColorBuffer);
		//webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(fakePoints.colors), webgl.STATIC_DRAW);
	}

	for(var i = 0; i < points.vertices.length; i+=3)
	{		
		//Update position
		points.vertices[i] += points.motion[i] * dt;
		points.vertices[i + 1] += points.motion[i + 1] * dt;
		points.vertices[i + 2] += points.motion[i + 2] * dt;
		
		//Update velocity
		points.motion[i] += points.acceleration[i] * dt;
		points.motion[i + 1] += points.acceleration[i + 1] * dt;
		points.motion[i + 2] += points.acceleration[i + 2] * dt;
		/*
		var speed = Math.sqrt(
			points.vertices[i] * points.vertices[i] +
			points.vertices[i + 1] * points.vertices[i + 1] +
			points.vertices[i + 2] * points.vertices[i + 2]
		);
		*/
		//points.colors[i + i/3] = 1 / (speed * .2) + Math.random() / 8 + .2;
		//points.colors[i + i/3 + 1] = Math.random() / 10;
		//points.colors[i + i/3 + 2] = 1 / (speed * .2) + Math.random() / 8 + .2;
		
	}
}  

function UpdateAcclerationOld()
{
	//Acclerate Planets
	for(var i = 0; i < planets.length; i++)
	{
		planets[i].acceleration = vec3.create();
		for(var j = 0; j < planets.length; j++)
		{			
			calculations++;
			var rx = planets[j].position[0] - planets[i].position[0];
			var ry = planets[j].position[1] - planets[i].position[1];
			var rz = planets[j].position[2] - planets[i].position[2];
			var r = Math.sqrt(rx * rx + ry * ry + rz * rz);			
			var acceleration = (G * planets[j].mass) / (r * r);
			if(r > planets[i].radius + planets[j].radius)
			{
				planets[i].acceleration[0] += rx * acceleration / r;
				planets[i].acceleration[1] += ry * acceleration / r;
				planets[i].acceleration[2] += rz * acceleration / r;
			}			
		}
		planets[i].UpdateTrail();
	}
}

function MoveParticlesWithIntegration()
{
	if(points.vertices.length > 0)
	{
		points.acceleration = [];
		for(var i = 0; i < points.vertices.length; i+=3)
		{
			var body = {};
			body.accleration = vec3.create();
			body.motion = vec3.create();
			body.position = vec3.create();
			body.radius = 0.1;
			body.mass = 0.1;
			body.motion[0] = points.motion[i];
			body.motion[1] = points.motion[i + 1];
			body.motion[2] = points.motion[i + 2];
			body.position[0] = points.vertices[i];
			body.position[1] = points.vertices[i + 1];
			body.position[2] = points.vertices[i + 2];			
			Integrate(body, t, dt, -1);
			points.acceleration[i] = body.accleration[0];
			points.acceleration[i + 1] = body.accleration[1];
			points.acceleration[i + 2] = body.accleration[2];
			points.motion[i] = body.motion[0];
			points.motion[i + 1] = body.motion[1];
			points.motion[i + 2] = body.motion[2];
			points.vertices[i] = body.position[0];
			points.vertices[i + 1] = body.position[1];
			points.vertices[i + 2] = body.position[2];
		}
		
		//Copy particles into webgl
		webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexPositionBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.vertices), webgl.STATIC_DRAW);
		
		webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexColorBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.colors), webgl.STATIC_DRAW);
	}
}

function UpdateAcclerationParticles()
{
	if(points.vertices.length > 0)
	{
		//Acclerate particles
		points.acceleration = [];

		for (var i = 0; i < points.vertices.length; i += 3)
		{
			points.acceleration[i] = 0;
			points.acceleration[i + 1] = 0;
			points.acceleration[i + 2] = 0;
			for(var j = 0; j < planets.length; j++)
			{			
				calculations++;
				var rx = planets[j].position[0] - points.vertices[i];
				var ry = planets[j].position[1] - points.vertices[i + 1];
				var rz = planets[j].position[2] - points.vertices[i + 2];
				var r = Math.sqrt(rx * rx + ry * ry + rz * rz);			
				var acceleration = (G * planets[j].mass) / (r * r);
				if(r > planets[j].radius)
				{
					points.acceleration[i] += rx * acceleration / r;
					points.acceleration[i + 1] += ry * acceleration / r;
					points.acceleration[i + 2] += rz * acceleration / r;
				}			
			}
		}
		
		//Copy particles into webgl
		webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexPositionBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.vertices), webgl.STATIC_DRAW);
		
		webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexColorBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.colors), webgl.STATIC_DRAW);
	}
}

function UpdateAcclerationStars()
{
	//Acclerate Stars
	for(var i = 0; i < stars.length; i++)
	{
		stars[i].acceleration = vec3.create();
		for(var j = 0; j < planets.length; j++)
		{			
			calculations++;
			var rx = planets[j].position[0] - stars[i].position[0];
			var ry = planets[j].position[1] - stars[i].position[1];
			var rz = planets[j].position[2] - stars[i].position[2];
			var r = Math.sqrt(rx * rx + ry * ry + rz * rz);			
			var acceleration = (G * planets[j].mass) / (r * r);
			if(r > planets[j].radius)
			{
				stars[i].acceleration[0] += rx * acceleration / r;
				stars[i].acceleration[1] += ry * acceleration / r;
				stars[i].acceleration[2] += rz * acceleration / r;
			}			
		}
	}
}

function FindFirstCollisions(time)
{
	//var collision = {i: -1, j: -1, time: time};
	var collisions = [{i: -1, j: -1, time: time}];
	
	for(var i = 0; i < planets.length - 1; i++)
	{
		for(j = i+1; j < planets.length; j++)
		{
			//Check the future distance to see if there is a collision
			var rx = (planets[j].position[0] + planets[j].motion[0] * time) - (planets[i].position[0] + planets[i].motion[0] * time);
			var ry = (planets[j].position[1] + planets[j].motion[1] * time) - (planets[i].position[1] + planets[i].motion[1] * time);
			var rz = (planets[j].position[2] + planets[j].motion[2] * time) - (planets[i].position[2] + planets[i].motion[2] * time);			
			var r = Math.sqrt(rx * rx + ry * ry + rz * rz);			
			if(r < planets[j].radius + planets[i].radius)
			{			
				var currentCollision = GetCollisionData(i, j, r, time);
				
				if (collisions[0].time > currentCollision.time)
					collisions = [currentCollision];
				else if (collisions[0].time == currentCollision.time)
					collisions.push(currentCollision);
			}
		}
	}
	
	return collisions;
}

function GetCollisionData(i, j, r, time)
{		
	var rx = (planets[j].position[0]) - (planets[i].position[0]);
	var ry = (planets[j].position[1]) - (planets[i].position[1]);
	var rz = (planets[j].position[2]) - (planets[i].position[2]);			
	var r1 = Math.sqrt(rx * rx + ry * ry + rz * rz);		
			
	var distance = r1 - (planets[j].radius + planets[i].radius);
	var v1 = Math.sqrt(
		planets[i].motion[0] * planets[i].motion[0] + 
		planets[i].motion[1] * planets[i].motion[1] +
		planets[i].motion[2] * planets[i].motion[2]
	);
	var v2 = Math.sqrt(
		planets[j].motion[0] * planets[j].motion[0] + 
		planets[j].motion[1] * planets[j].motion[1] +
		planets[j].motion[2] * planets[j].motion[2]
	);	
	
	var collisionTime = distance / (v1 + v2);
	return {i: i, j: j, time: collisionTime};
}

function CalculateCollisionSpin(obj1, obj2)
{
	var vec_r = vec3.create();
	var inertia = (2/5) * obj1.mass * obj1.radius * obj1.radius;
	
	vec_r[0] = obj1.position[0] - obj2.position[0];
	vec_r[1] = obj1.position[1] - obj2.position[1];
	vec_r[2] = obj1.position[2] - obj2.position[2];
	vec3.normalize(vec_r);
	vec_r[0] = vec_r[0] * obj1.radius;
	vec_r[1] = vec_r[1] * obj1.radius;
	vec_r[2] = vec_r[2] * obj1.radius;
	
	var vec_v = vec3.create();
	vec_v[0] = (obj1.motion[0] - obj2.motion[0]) * obj2.mass;
	vec_v[1] = (obj1.motion[1] - obj2.motion[1]) * obj2.mass;
	vec_v[2] = (obj1.motion[2] - obj2.motion[2]) * obj2.mass;
	
	var vec_w = vec3.create();
	vec_w = vec3.cross(vec_r, vec_v);
	
	vec_w = vec3.scale(vec_w, 1/(inertia));

	var friction = 0.5;
	obj1.angularVelocity[0] += vec_w[0];
	obj1.angularVelocity[1] += vec_w[1];
	obj1.angularVelocity[2] += vec_w[2];

	obj1.angularVelocity[0] *= friction;
	obj1.angularVelocity[1] *= friction;
	obj1.angularVelocity[2] *= friction;
		
	if(vec3.length(obj1.angularVelocity) > 1)
		vec3.normalize(obj1.angularVelocity);
}

function CalculateCollisionResponse(collision)
{
	var obj1 = planets[collision.i];
	var obj2 = planets[collision.j];
	var U1x = vec3.create();
	var U1y = vec3.create();
	var U2x = vec3.create();
	var U2y = vec3.create();
	var V1x = vec3.create();
	var V1y = vec3.create();
	var V2x = vec3.create();
	var V2y = vec3.create();
	
	var m1, m2, x1, x2;
	
	var v1temp = vec3.create();
	var v1 = vec3.create();
	var v2 = vec3.create();
	var v1x = vec3.create();
	var v2x = vec3.create();
	var v1y = vec3.create();
	var v2y = vec3.create();
	var x = vec3.create();
	
	x[0] = (obj1.position[0] - obj2.position[0]);
	x[1] = (obj1.position[1] - obj2.position[1]);
	x[2] = (obj1.position[2] - obj2.position[2]);
	
	vec3.normalize(x);
	v1[0] = obj1.motion[0];
	v1[1] = obj1.motion[1];
	v1[2] = obj1.motion[2];
	
	x1 = vec3.dot(x, v1);
	v1x[0] = x[0] * x1;
	v1x[1] = x[1] * x1;
	v1x[2] = x[2] * x1;
	v1y[0] = v1[0] - v1x[0];
	v1y[1] = v1[1] - v1x[1];
	v1y[2] = v1[2] - v1x[2];
	m1 = obj1.mass;
	
	x[0] = x[0] * -1;
	x[1] = x[1] * -1;
	x[2] = x[2] * -1;
	v2[0] = obj2.motion[0];
	v2[1] = obj2.motion[1];
	v2[2] = obj2.motion[2];
	x2 = vec3.dot(x, v2);
	v2x[0] = x[0] * x2;
	v2x[1] = x[1] * x2;
	v2x[2] = x[2] * x2;
	v2y[0] = v2[0] - v2x[0];
	v2y[1] = v2[1] - v2x[1];
	v2y[2] = v2[2] - v2x[2];
	m2 = obj2.mass;
	
	obj1.motion[0] = (v1x[0] * (m1 - m2) / (m1 + m2) + v2x[0] * (2 * m2) / (m1 + m2) + v1y[0]);
	obj1.motion[1] = (v1x[1] * (m1 - m2) / (m1 + m2) + v2x[1] * (2 * m2) / (m1 + m2) + v1y[1]);
	obj1.motion[2] = (v1x[2] * (m1 - m2) / (m1 + m2) + v2x[2] * (2 * m2) / (m1 + m2) + v1y[2]);
	
	obj2.motion[0] = (v1x[0] * (2 * m1) / (m1 + m2) + v2x[0] * (m2 - m1) / (m1 + m2) + v2y[0]);
	obj2.motion[1] = (v1x[1] * (2 * m1) / (m1 + m2) + v2x[1] * (m2 - m1) / (m1 + m2) + v2y[1]);
	obj2.motion[2] = (v1x[2] * (2 * m1) / (m1 + m2) + v2x[2] * (m2 - m1) / (m1 + m2) + v2y[2]);
}

function CalcCenterOfMass(objects)
{
	var cmx = 0;
	var cmy = 0;
	var cmz = 0;
	var mass = 0;
	var cvx = 0;
	var cvy = 0;
	var cvz = 0;
	
	for(var i = 0; i < objects.length; i++)
	{
		var newMass = mass + objects[i].mass;
		cmx = (cmx * mass + objects[i].position[0] * objects[i].mass) / newMass;
		cmy = (cmy * mass + objects[i].position[1] * objects[i].mass) / newMass;
		cmz = (cmz * mass + objects[i].position[2] * objects[i].mass) / newMass;	
		cvx += objects[i].motion[0] / objects[i].mass;
		cvy += objects[i].motion[1] / objects[i].mass;
		cvz += objects[i].motion[2] / objects[i].mass;
		
		mass = newMass;
	}
	
	return {
		x: cmx, 
		y: cmy,
		z: cmz,
		vx: 0,
		vy: 0,
		vz: 0,
		mass: mass
	};
}

function SetOrbit2(obj1, obj2, objects, axisName)
{
	var cm = CalcCenterOfMass(objects);
	
	var rx = cm.x - obj1.position[0];
	var ry = cm.y - obj1.position[1];
	var rz = cm.z - obj1.position[2];
	var r = Math.sqrt( rx * rx + ry * ry + rz * rz );
	var v = Math.sqrt((G * cm.mass) / r);
	
	var vecDir = vec3.create();		
	vec3.direction(obj1.position, obj2.position, vecDir);
	vec3.normalize(vecDir);
	obj1.motion[0] = vecDir[0] * v + cm.vx;
	obj1.motion[1] = vecDir[1] * v + cm.vy;
	obj1.motion[2] = vecDir[2] * v + cm.vz;
}

function SetOrbit(object, objects, axisName)
{
	var cm = CalcCenterOfMass(objects);
		
	var rx = cm.x - object.position[0];
	var ry = cm.y - object.position[1];
	var rz = cm.z - object.position[2];
	var r = Math.sqrt( rx * rx + ry * ry + rz * rz );
	
	if(r > 0)
	{
		var v = Math.sqrt((G * cm.mass) / r);		
		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);
		
		if(!axisName)
		{
			var rnd = Math.random() * 3;
			if(rnd > 2)
				mat4.rotateX(mvMatrix, Math.PI / 2);
			else if(rnd > 1)
				mat4.rotateY(mvMatrix, Math.PI / 2);
			else
				mat4.rotateZ(mvMatrix, Math.PI / 2);
		}
		else
		{
			if(axisName == "x")
			{
				mat4.rotateX(mvMatrix, Math.PI / 2);
			}
			else if(axisName == "y")
			{
				mat4.rotateY(mvMatrix, Math.PI / 2);
				//mat4.rotate(mvMatrix, -Math.PI / 2, [1/rx, 0, 1/rz]);
			}
			else
			{
				mat4.rotateZ(mvMatrix, Math.PI / 2);
			}
		}
		var vecDir = vec3.create();		
		vecDir[0] = cm.x;
		vecDir[1] = cm.y;
		vecDir[2] = cm.z;
		vec3.direction(vecDir, object.position);
		vec3.normalize(vecDir);
				
		mat4.multiplyVec3(mvMatrix, vecDir);
		//object.motion[0] = vecDir[0] * v / r + cm.vx;
		//object.motion[1] = vecDir[1] * v / r + cm.vy;
		//object.motion[2] = vecDir[2] * v / r + cm.vz;
		object.motion[0] = vecDir[0] * v + cm.vx;
		object.motion[1] = vecDir[1] * v + cm.vy;
		object.motion[2] = vecDir[2] * v + cm.vz;
	}
}

//center, force, radius
function ApplyExplosion(explosion, index)
{
	for(var i = 0; i < planets.length; i++)
	{
		var rx = explosion.center[0] - planets[i].position[0];
		var ry = explosion.center[1] - planets[i].position[1];
		var rz = explosion.center[2] - planets[i].position[2];			
		var r = Math.sqrt(rx * rx + ry * ry + rz * rz);	

		if(r < explosion.radius && r > explosion.oldRadius)
		{
			var vecDir = vec3.create();
			vecDir[0] = rx;
			vecDir[1] = ry;
			vecDir[2] = rz;
			vec3.normalize(vecDir);
			planets[i].motion[0] -= vecDir[0] * (explosion.force / planets[i].mass);
			planets[i].motion[1] -= vecDir[1] * (explosion.force / planets[i].mass);
			planets[i].motion[2] -= vecDir[2] * (explosion.force / planets[i].mass);

			var r2 = Math.sqrt(
				planets[i].motion[0] * planets[i].motion[0] +
				planets[i].motion[1] * planets[i].motion[1] +
				planets[i].motion[2] * planets[i].motion[2]
			);

			if (r2 > explosion.speed) 
			{
				planets[i].motion[0] = -vecDir[0] * explosion.speed;
				planets[i].motion[1] = -vecDir[1] * explosion.speed;
				planets[i].motion[2] = -vecDir[2] * explosion.speed;
			}

			if(explosion.force > planets[i].mass * explosionSensitivity)
			{
				ExplodePlanet(planets[i]);
			}
		}		
	}
	
	explosion.oldRadius = explosion.radius;
	explosion.radius += explosion.speed * dt;
	explosion.force = explosion.forceOrig / (explosion.radius * explosion.radius);
	
	if(explosion.force < .1)
		deleteExplosions.push(index);
}

var deletePlanets = [];
function ApplyExplosions()
{
	deletePlanets = [];
	deleteExplosions = [];
	for(var i = 0; i < explosions.length; i++)
	{
		ApplyExplosion(explosions[i], i);
	}
	
	for(var i = 0; i < deleteExplosions.length; i++)
	{
		explosions.splice(deleteExplosions[i], 1);
	}
	
	for(var i = deletePlanets.length - 1; i >= 0; i--)
	{
		explosions.push({
			center: planets[deletePlanets[i]].position,
			force: planets[deletePlanets[i]].mass * forcePush,
			forceOrig: planets[deletePlanets[i]].mass * forcePush,
			radius: planets[deletePlanets[i]].radius,
			speed: planets[deletePlanets[i]].radiuso * forceDispersion,
			oldRadius: 0
		});
		planets.splice(deletePlanets[i], 1);
		InitializeSelObjects();
	}
}

function ExplodePlanet(planet)
{
	var vertices = points.vertices;
	var motion = points.motion;
	var colors = points.colors;
	var count = explosionParticles * planet.radius;
	for(var i = 0; i < count; i++)
	{
		var r = planet.radius;
		var a1 = Math.random() * Math.PI * 2;
		var a2 = Math.random() * Math.PI * 2;
		var x = Math.sin(a1)*Math.cos(a2) * r + planet.position[0];
		var y = Math.sin(a1)*Math.sin(a2) * r + planet.position[1];
		var z = Math.cos(a1) * r + planet.position[2];
		
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		
		motion.push((x - planet.position[0] + planet.motion[0]) * forceDispersion);
		motion.push((y - planet.position[1] + planet.motion[1]) * forceDispersion);
		motion.push((z - planet.position[2] + planet.motion[2]) * forceDispersion);
					
		colors.push(planet.color[0] + planet.color[3] * Math.random());
		colors.push(planet.color[1] + planet.color[3] * Math.random());
		colors.push(planet.color[2] + planet.color[3] * Math.random());
		colors.push(1.0);
	}
	
	points = CreatePoints(vertices, colors);
	points.motion = motion;
	deletePlanets.push(planet.index);
}

