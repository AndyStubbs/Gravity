var root = [];
var treeDepth = 0;
var maxDepth = 100;

var maxX = 1000;
var maxY = 1000;
var maxZ = 1000;
var minX = -1000;
var minY = -1000;
var minZ = -1000;
var theta = 2;

function UpdateAccleration(bodies)
{
	InitializeTree(bodies);
	for(var i = 0; i < bodies.length; i++)
	{
		bodies[i].acceleration = vec3.create();
		CollectAccleration(root, bodies[i]);		
	}
}

function CollectAccleration(node, body)
{
	var bFound = false;
	var s = node.x2 - node.x1;
	
	for(var i in node.branch)
	{
		bFound = true;
		var dx = node.branch[i].cmx - body.position[0];
		var dy = node.branch[i].cmy - body.position[1];
		var dz = node.branch[i].cmz - body.position[2];
		var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
		
		if( s / d > theta)
			CollectAccleration(node.branch[i], body);
		else
		{
			CalculateAccleration(body, node.branch[i], d, dx, dy, dz);
		}
	}
	
	if(!bFound)
	{
		var dx = node.cmx - body.position[0];
		var dy = node.cmy - body.position[1];
		var dz = node.cmz - body.position[2];
		var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
		CalculateAccleration(body, node.body, d, dx, dy, dz);
	}
}

function InitializeTree(bodies)
{
	root = {
		x1: minX, 
		x2: maxX, 
		y1: minY, 
		y2: maxY,
		z1: minZ,
		z2: maxZ,
		mass: 0, 
		cmx: 0, 
		cmy: 0,
		cmz: 0,
		radius: 0,
		branch: []
	};
	for(i = 0; i < bodies.length; i++)
	{
		treeDepth = 0;
		InsertNode(root, bodies[i]);
	}
}

function InsertNode(node, body)
{
	if(treeDepth++ < maxDepth)
	{
		//Radius of node is the radius of the largest body
		if(node.radius < body.radius)
			node.radius = body.radius;
			
		//Compute center of mass
		var newMass = node.mass + body.mass;
		node.cmx = (node.cmx * node.mass + body.position[0] * body.mass) / newMass;
		node.cmy = (node.cmy * node.mass + body.position[1] * body.mass) / newMass;
		node.cmz = (node.cmz * node.mass + body.position[2] * body.mass) / newMass;	
		node.mass = newMass;
		
		//Compute dimensions
		var width = node.x2 - node.x1;
		var height = node.y2 - node.y1;
		var depth = node.z2 - node.z1;
		
		//Get octant and dimensions
		var i = 0;
		var x1, x2, y1, y2, z1, z2;
		
		//if it's in the east half
		if (node.x1 + width / 2 < body.position[0]) 
		{
			i = 1;		
			x1 = node.x1 + (width / 2);
			x2 = node.x1 + width;
		}
		else
		{
			x1 = node.x1;
			x2 = node.x1 + width / 2;
		}
		
		//if it's in the south half
		if (node.y1 + height / 2 < body.position[1]) 
		{
			i += 2;
			y1 = node.y1 + (height / 2);
			y2 = node.y1 + height;
		}
		else
		{
			y1 = node.y1;
			y2 = node.y1 + (height / 2);	
		}		
		
		//if it's in the lower half
		if (node.z1 + depth / 2 < body.position[2]) 
		{
			i += 4;
			z1 = node.z1 + (depth / 2);
			z2 = node.z1 + depth;
		}
		else
		{
			z1 = node.z1;
			z2 = node.z1 + (height / 2);
		}
		
		//Insert Node into branch
		if(node.branch[i])
		{
			if(node.branch[i].body)
			{
				InsertNode(node.branch[i], node.branch[i].body);
				node.branch[i].mass -= node.branch[i].body.mass;						
			}
			InsertNode(node.branch[i], body);
			node.branch[i].body = false;
		}
		else
		{
			node.branch[i] = {
				x1: x1, 
				x2: x2, 
				y1: y1, 
				y2: y2,
				z1: z1,
				z2: z2,
				body: body,
				mass: body.mass, 
				cmx: body.position[0], 
				cmy: body.position[1],
				cmz: body.position[2],
				radius: body.radius,
				branch: []
			};
		}
	}
}

function UpdateAcclerationParticles2()
{
	if(points.vertices.length > 0)
	{
		//Acclerate particles
		points.acceleration = [];
		for(var i = 0; i < points.vertices.length; i+=3)
		{
			var acceleration = vec3.create();
			var position = vec3.create();
			position[0] = points.vertices[i];
			position[1] = points.vertices[i + 1];
			position[2] = points.vertices[i + 2];
			
			var body = {
				position: position,
				acceleration: acceleration,
				radius: 1
			};
			CollectAccleration(root, body);
			points.acceleration[i] = body.acceleration[0];
			points.acceleration[i + 1] = body.acceleration[1];
			points.acceleration[i + 2] = body.acceleration[2];
		}
		
		//Copy particles into webgl
		webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexPositionBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.vertices), webgl.STATIC_DRAW);
	}
}



















