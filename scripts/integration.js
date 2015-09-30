function CalcAccelarationInt(planet, i, dt)
{
	planet.acceleration = vec3.create();
	for(var j = 0; j < planets.length; j++)
	{
		if(j != i)
		{			
			calculations++;
			var rx = planets[j].position[0] - planet.position[0];
			var ry = planets[j].position[1] - planet.position[1];
			var rz = planets[j].position[2] - planet.position[2];
			var r = Math.sqrt(rx * rx + ry * ry + rz * rz);			
			var acceleration = (G * planets[j].mass) / (r * r);
			if(r > planet.radius + planets[j].radius)
			{
				planet.acceleration[0] += rx * acceleration / r;
				planet.acceleration[1] += ry * acceleration / r;
				planet.acceleration[2] += rz * acceleration / r;
			}
			else
			{
				var key = "";
				if(j > i)
					key = i + "_" + j;
				else
					key = j + "_" + i;
				
				collisions[key] = {i: i, j: j, dt: dt};	
			}
		}
	}
	
	return planet;
}

function Evaluate2(initial, t, dt, d, i)
{
	var state = {};
	state.position = vec3.create();
	state.motion = vec3.create();
	state.position[0] = initial.position[0] + d.dx * dt;
	state.position[1] = initial.position[1] + d.dy * dt;
	state.position[2] = initial.position[2] + d.dz * dt;
	state.motion[0] = initial.motion[0] + d.acceleration[0] * dt;
	state.motion[1] = initial.motion[1] + d.acceleration[1] * dt;
	state.motion[2] = initial.motion[2] + d.acceleration[2] * dt;
	state.mass = initial.mass;
	state.radius = initial.radius;
	
	var output = {};
	output.position = vec3.create();
	output.motion = vec3.create();
	output.dx = state.motion[0];
	output.dy = state.motion[1];
	output.dz = state.motion[2];
	output.position[0] = state.position[0];
	output.position[1] = state.position[1];
	output.position[2] = state.position[2];
	output.motion[0] = state.motion[0];
	output.motion[1] = state.motion[1];
	output.motion[2] = state.motion[2];
	output.mass = state.mass;
	output.radius = state.radius;
	CalcAccelarationInt(output, i, dt);
	
	return output;
}

function Evaluate1(initial, t, i)
{
	var output = {};
	output.position = vec3.create();
	output.motion = vec3.create();
	output.position[0] = initial.position[0];
	output.position[1] = initial.position[1];
	output.position[2] = initial.position[2];
	output.mass = initial.mass;
	output.radius = initial.radius;
	output.motion[0] = initial.motion[0];
	output.motion[1] = initial.motion[1];
	output.motion[2] = initial.motion[2];
	output.dx = initial.motion[0];
	output.dy = initial.motion[1];
	output.dz = initial.motion[2];
	
	CalcAccelarationInt(output, i, dt);
	return output;
}

function Integrate(state, t, dt, i)
{
	state.acceleration = vec3.create();
	var a = Evaluate1(state, t, i);
	var b = Evaluate2(state, t, dt * 0.5, a, i);
	var c = Evaluate2(state, t, dt * 0.5, b, i);
	var d = Evaluate2(state, t, dt, c, i);

	var dxdt = 1.0/6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
	var dydt = 1.0/6.0 * (a.dy + 2.0 * (b.dy + c.dy) + d.dy);
	var dzdt = 1.0/6.0 * (a.dz + 2.0 * (b.dz + c.dz) + d.dz);
	var dvxdt = 1.0/6.0 * (a.acceleration[0] + 2.0 * (b.acceleration[0] + c.acceleration[0]) + d.acceleration[0]);
	var dvydt = 1.0/6.0 * (a.acceleration[1] + 2.0 * (b.acceleration[1] + c.acceleration[1]) + d.acceleration[1]);
	var dvzdt = 1.0/6.0 * (a.acceleration[2] + 2.0 * (b.acceleration[2] + c.acceleration[2]) + d.acceleration[2]);
	
	state.position[0] = state.position[0] + dxdt * dt;
	state.position[1] = state.position[1] + dydt * dt;
	state.position[2] = state.position[2] + dzdt * dt;
	state.motion[0] = state.motion[0] + dvxdt * dt;
	state.motion[1] = state.motion[1] + dvydt * dt;
	state.motion[2] = state.motion[2] + dvzdt * dt;
	state.acceleration[0] = dvxdt;
	state.acceleration[1] = dvydt;
	state.acceleration[2] = dvzdt;
}



















