var canvas;
var webgl;
var shaderProgram;
var shaderProgramTextured;
var mvMatrix;
var pMatrix;
var centerOfMassStar;
var orbits = [];
var aspectRatio;
var grid = false;

var randomImages = [];
for(var i = 0; i < 10; i++)
	randomImages.push("randommap0" + i + ".png");
for(var i = 10; i < 15; i++)
	randomImages.push("randommap" + i + ".png");

function Draw()
{
	//Setup the viewport
	webgl.viewport(0, 0, webgl.viewportWidth, webgl.viewportHeight);
	
	//Create the background
	webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

	//Setup the viewport perspective
	mat4.perspective(45, aspectRatio, 0.1, sightDistance, pMatrix);	

	var mvStart = mat4.create();

	mvMatrix = camera.GetMatrix();
	mat4.set(mvMatrix, mvStart);	
	if(camera.mode == "look" && camera.targets.length > 1)
	{
		centerOfMassStar.position = camera.target;
		DrawObject(centerOfMassStar);
	}
	var newMass = 0;	
	for(var i = 0; i < planets.length; i++)
	{
		mat4.set(mvStart, mvMatrix);
		DrawObject(planets[i]);
		if(planets[i].trailModel)
		{
			mat4.set(mvStart, mvMatrix);
			DrawLines(planets[i].trailModel);
		}
		mat4.set(mvStart, mvMatrix);
		planets[i].DrawVector();
		//PrintData(planets[i]);
	}	
	
	for(var i = 0; i < orbits.length; i++)
	{
		mat4.set(mvStart, mvMatrix);
		DrawLines(orbits[i]);
	}
	
	mat4.set(mvStart, mvMatrix);
	if(points.vertices.length > 1)
		DrawPoints(points);

	if(fakePoints.vertices.length > 1)
		DrawPoints(fakePoints);

	if(grid)
		DrawLineNonStrip(grid);
}

function DrawTextured()
{		
	webgl.useProgram(shaderProgram);

	//Setup the viewport
	webgl.viewport(0, 0, webgl.viewportWidth, webgl.viewportHeight);
	
	//Create the background
	webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

	//Setup the viewport perspective
	mat4.perspective(45, aspectRatio, 0.1, sightDistance, pMatrix);	

	var mvStart = mat4.create();
	
	mvMatrix = camera.GetMatrix();
	mat4.set(mvMatrix, mvStart);
	
	if(camera.mode == "look" && camera.targets.length > 1)
	{
		centerOfMassStar.position = camera.target;
		DrawObject(centerOfMassStar);
	}
	var newMass = 0;	
	for(var i = 0; i < planets.length; i++)
	{
		if(planets[i].trailModel)
		{
			mat4.set(mvStart, mvMatrix);
			DrawLines(planets[i].trailModel);
		}
		mat4.set(mvStart, mvMatrix);
		planets[i].DrawVector();
		//PrintData(planets[i]);
	}	
	
	for(var i = 0; i < orbits.length; i++)
	{
		mat4.set(mvStart, mvMatrix);
		DrawLines(orbits[i]);
	}
	
	mat4.set(mvStart, mvMatrix);
	if(points.vertices.length > 1)
		DrawPoints(points);
	
	if(fakePoints.vertices.length > 1)
		DrawPoints(fakePoints);

	if(grid)
		DrawLineNonStrip(grid);

	webgl.useProgram(shaderProgramTextured);
	for(var i = 0; i < planets.length; i++)
	{
		mat4.set(mvStart, mvMatrix);
		DrawObjectTextured(planets[i]);
	}
	
}

function PrintData(obj)
{
	/*var div_data = document.getElementById("div_data");
	
	div_data.innerHTML += "angleX: " + obj.sphere.angleX + "<br />";
	div_data.innerHTML += "angleY: " + obj.sphere.angleY + "<br />";
	div_data.innerHTML += "angleZ: " + obj.sphere.angleZ + "<br />";*/
}

function DrawObject(obj3D)
{
	mat4.translate(mvMatrix, [obj3D.position[0], obj3D.position[1], obj3D.position[2]]);
	
	mat4.rotate(mvMatrix, vec3.length(obj3D.rotation), obj3D.rotation, mvMatrix);
	
	webgl.bindBuffer(webgl.ARRAY_BUFFER, obj3D.model.vertexPositionBuffer);

	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj3D.model.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the color buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, obj3D.model.vertexColorBuffer);

	//Point webgl to the color attribute
	webgl.vertexAttribPointer(shaderProgram.vertexColorAttribute, obj3D.model.vertexColorBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, obj3D.model.vertexIndexBuffer);

	//Copy the uniforms to the shder program
	setMatrixUniforms();

	//Draw the object
	webgl.drawElements(webgl.TRIANGLES, obj3D.model.vertexIndexBuffer.numItems, webgl.UNSIGNED_SHORT, 0);
}

function DrawObjectTextured(obj3D)
{
	mat4.translate(mvMatrix, [obj3D.position[0], obj3D.position[1], obj3D.position[2]]);
	
	mat4.rotate(mvMatrix, vec3.length(obj3D.rotation), obj3D.rotation, mvMatrix);
	
	webgl.bindBuffer(webgl.ARRAY_BUFFER, obj3D.model.vertexPositionBuffer);

	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgramTextured.vertexPositionAttribute, obj3D.model.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the texture buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, obj3D.model.textureBuffer);

	//Point webgl to the texture attribute
	webgl.vertexAttribPointer(shaderProgramTextured.textureCoordAttribute, obj3D.model.textureBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//bind the texture to webgl
	webgl.activeTexture(webgl.TEXTURE0);
	webgl.bindTexture(webgl.TEXTURE_2D, obj3D.model.texture);
	webgl.uniform1i(shaderProgramTextured.samplerUniform, 0);
	
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, obj3D.model.vertexIndexBuffer);

	//Copy the uniforms to the shder program
	setMatrixUniformsTextured();

	//Draw the object
	webgl.drawElements(webgl.TRIANGLES, obj3D.model.vertexIndexBuffer.numItems, webgl.UNSIGNED_SHORT, 0);
}

function DrawPoints(points)
{	
	webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexPositionBuffer);
	
	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, points.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the color buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexColorBuffer);

	//Point webgl to the color attribute
	webgl.vertexAttribPointer(shaderProgram.vertexColorAttribute, points.vertexColorBuffer.itemSize, webgl.FLOAT, false, 0, 0);

	//Copy the uniforms to the shder program
	setMatrixUniforms();

	//Draw the object
	webgl.drawArrays(webgl.POINTS, 0, points.vertexPositionBuffer.numItems);
}

function DrawLines(lines)
{
	webgl.bindBuffer(webgl.ARRAY_BUFFER, lines.vertexPositionBuffer);
	
	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lines.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the color buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, lines.vertexColorBuffer);

	//Point webgl to the color attribute
	webgl.vertexAttribPointer(shaderProgram.vertexColorAttribute, lines.vertexColorBuffer.itemSize, webgl.FLOAT, false, 0, 0);

	//Copy the uniforms to the shder program
	setMatrixUniforms();

	//Draw the object
	webgl.drawArrays(webgl.LINE_STRIP, 0, lines.vertexPositionBuffer.numItems);
}

function DrawLineNonStrip(lines)
{
	webgl.bindBuffer(webgl.ARRAY_BUFFER, lines.vertexPositionBuffer);
	
	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lines.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the color buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, lines.vertexColorBuffer);

	//Point webgl to the color attribute
	webgl.vertexAttribPointer(shaderProgram.vertexColorAttribute, lines.vertexColorBuffer.itemSize, webgl.FLOAT, false, 0, 0);

	//Copy the uniforms to the shder program
	setMatrixUniforms();

	//Draw the object
	webgl.drawArrays(webgl.LINES, 0, lines.vertexPositionBuffer.numItems);
}

function InitGraphics()
{
	mvMatrix = mat4.create();
	pMatrix = mat4.create();
	InitWebGL();
	InitShaders();
	InitComponets();
}

function InitComponets()
{
	centerOfMassStar = CreateStarObject(1, 1, [0, .5, 0, .5], 4);	
}

function CreatePlanetObject(radius, mass, color)
{
	var motion = vec3.create();	
	var position = vec3.create();	
	var rotation = vec3.create();	
	var angularVelocity = vec3.create();
	
	var planetCount = planets.length;
	var planet = {
		position: position,
		motion: motion,
		rotation: rotation,
		angularVelocity: angularVelocity,
		radius: radius,
		mass: mass,
		model: CreateSphere(radius, color, 4),
		color: color,
		trail: [],
		trailModel: false,
		UpdateTrail: function () {},
		DrawVector: function () {},
		vectorModel: CreateOrbit(color, [1,1,1,2,2,2,3,3,3,4,4,4]),
		index: planetCount,
	};
	
	return planet;
}

function CreatePlanetObjectTextured(radius, mass, color, image)
{
	var motion = vec3.create();	
	var position = vec3.create();	
	var rotation = vec3.create();	
	var angularVelocity = vec3.create();	
	var planetCount = planets.length;
	var planet = {
		position: position,
		motion: motion,
		rotation: rotation,
		angularVelocity: angularVelocity,
		radius: radius,
		mass: mass,
		model: CreateSphereTextured(radius, ProcessTexture(image)),
		color: color,
		trail: [],
		trailModel: false,
		UpdateTrail: function () {},
		DrawVector: function () {},
		vectorModel: CreateOrbit(color, [1,1,1,2,2,2,3,3,3,4,4,4]),
		index: planetCount,
	};
	
	return planet;
}

function CreateStarObject(radius, mass, color, points)
{
	var motion = vec3.create();	
	var position = vec3.create();	
	var rotation = vec3.create();	
	var angularVelocity = vec3.create();
	
	var star = {
		position: position,
		motion: motion,
		rotation: rotation,
		angularVelocity: angularVelocity,
		radius: radius,
		mass: mass,
		model: CreateStar3D(radius, color, points)
	};
	
	return star;
}

function InitWebGL()
{
	canvas = document.getElementById("myCanvas");	
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	
	var contextNames = ["webgl","experimental-webgl"];	
	var contextName;
	for(var i = 0; i < contextNames.length && !webgl; i++)
	{
		contextName = contextNames[i];
		try 
		{
			webgl = canvas.getContext(contextName);
			webgl.viewportWidth = canvas.width;
			webgl.viewportHeight = canvas.height;
			webgl.enable(webgl.DEPTH_TEST);
			aspectRatio = webgl.viewportWidth / webgl.viewportHeight;
		} 
		catch (e) 
		{

		}
	}

	if (!webgl) 
	{
	    alert("Could not initialise WebGL");
		document.write("Your web browser does not support WebGL. ");
		document.write("This website recommends the Chrome web browser found in the following link. ");
		document.write("<br />");
		document.write("<br />");
		document.write("<a href='http://www.google.com/chrome'>http://www.google.com/chrome</a>");
		document.write("<br />");
		document.write("<br />");
		document.write("If you don't wish to use Chrome see the following link for instructions on obtaining other compatible browsers.");
		document.write("<br />");
		document.write("<br />");
		document.write("<a href='http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>");
		document.write("http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation</a>");

	}
	else
	{
		//alert("Initialized WebGL with " + contextName);
	}
}

function InitShaders()
{
	//Source code for the fragment shader
	var fragmentShaderStr = "" +
		"precision mediump float;" +
		"varying vec4 vColor;" + 
		"void main(void) {" +
		    "gl_FragColor = vColor;"+
		"}";

	//Create & compile the fragment shader
	var fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
	webgl.shaderSource(fragmentShader, fragmentShaderStr);
    webgl.compileShader(fragmentShader);

	if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) 
	{
		alert("fragmentShader: " + webgl.getShaderInfoLog(fragmentShader));
		return null;
	}

    //Source code for the vertex shader
	var vertexShaderStr = "" +
		"attribute vec3 aVertexPosition;" +
		"attribute vec4 aVertexColor;" + 
		"uniform mat4 uMVMatrix;" +
		"uniform mat4 uPMatrix;" +
		"varying vec4 vColor;" + 
		"void main(void) {" + 
		    "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
		    "vColor = aVertexColor;" + 
			"gl_PointSize = " + pointSize.toFixed(2) + ";" +
		"}";

	//Create and compile the vertex shader
	var vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
	webgl.shaderSource(vertexShader, vertexShaderStr);
	webgl.compileShader(vertexShader);

	if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) 
	{
		alert("vertexShader: " + webgl.getShaderInfoLog(vertexShader));
		return null;
	}

	//Create the shader program
	shaderProgram = webgl.createProgram();
	webgl.attachShader(shaderProgram, vertexShader);
	webgl.attachShader(shaderProgram, fragmentShader);
	webgl.linkProgram(shaderProgram);

	//Assign the active program to this shaderProgram
	webgl.useProgram(shaderProgram);

	//Assign the vertex attribute position to the shader program
	shaderProgram.vertexPositionAttribute = webgl.getAttribLocation(shaderProgram, "aVertexPosition");
	shaderProgram.vertexColorAttribute = webgl.getAttribLocation(shaderProgram, "aVertexColor");

	//Enable the vertex attribute in webgl
	webgl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	webgl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	//Configure the uniforms
	shaderProgram.pMatrixUniform = webgl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = webgl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function InitTextureShaders()
{
	//Source code for the fragment shader
	var fragmentShaderStr = "" +
		"precision mediump float;" +
		"varying vec2 vTextureCoord;" + 
		"uniform sampler2D uSampler;" +
		"void main(void) {" +
		    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));"+
		"}";

	//Create & compile the fragment shader
	var fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
	webgl.shaderSource(fragmentShader, fragmentShaderStr);
    webgl.compileShader(fragmentShader);

	if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) 
	{
		alert("fragmentShader: " + webgl.getShaderInfoLog(fragmentShader));
		return null;
	}

    //Source code for the vertex shader
	var vertexShaderStr = "" +
		"attribute vec3 aVertexPosition;" +
		"attribute vec2 aTextureCoord;" + 
		"uniform mat4 uMVMatrix;" +
		"uniform mat4 uPMatrix;" +
		"varying vec2 vTextureCoord;" + 
		"void main(void) {" + 
		    "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
		    "vTextureCoord = aTextureCoord;" +
		"}";

	//Create and compile the vertex shader
	var vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
	webgl.shaderSource(vertexShader, vertexShaderStr);
	webgl.compileShader(vertexShader);

	if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) 
	{
		alert("vertexShader: " + webgl.getShaderInfoLog(vertexShader));
		return null;
	}

	//Create the shader program
	shaderProgramTextured = webgl.createProgram();
	webgl.attachShader(shaderProgramTextured, vertexShader);
	webgl.attachShader(shaderProgramTextured, fragmentShader);
	webgl.linkProgram(shaderProgramTextured);

	//Assign the active program to this shaderProgram
	webgl.useProgram(shaderProgramTextured);

	//Assign the vertex attribute position to the shader program
	shaderProgramTextured.vertexPositionAttribute = webgl.getAttribLocation(shaderProgramTextured, "aVertexPosition");
	shaderProgramTextured.textureCoordAttribute = webgl.getAttribLocation(shaderProgramTextured, "aTextureCoord");

	//Enable the vertex attribute in webgl
	webgl.enableVertexAttribArray(shaderProgramTextured.vertexPositionAttribute);
	webgl.enableVertexAttribArray(shaderProgramTextured.textureCoordAttribute);	

	//Configure the uniforms
	shaderProgramTextured.pMatrixUniform = webgl.getUniformLocation(shaderProgramTextured, "uPMatrix");
	shaderProgramTextured.mvMatrixUniform = webgl.getUniformLocation(shaderProgramTextured, "uMVMatrix");
	shaderProgramTextured.samplerUniform = webgl.getUniformLocation(shaderProgramTextured, "uSampler");
}

function ProcessTexture(image)
{
	var texture = webgl.createTexture();
	webgl.bindTexture(webgl.TEXTURE_2D, texture);
	webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);
	//webgl.pixelStorei(webgl.UNPACK_FLIP_X_WEBGL, true);
	webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
	webgl.bindTexture(webgl.TEXTURE_2D, null);
	return texture;	
}

function CreatePoints(vertices, color_data)
{
	var points = {};
	points.vertices = vertices;
	points.colors = color_data;
	
	//Create the vertex buffer
	points.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.vertices), webgl.STATIC_DRAW);

	//Specify the vertex data size
	points.vertexPositionBuffer.itemSize = 3;
	points.vertexPositionBuffer.numItems = points.vertices.length / 3;

	//Create the color buffer
	points.vertexColorBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, points.vertexColorBuffer);

	//Copy the colors	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points.colors), webgl.STATIC_DRAW);	

	//Specify the color data size
	points.vertexColorBuffer.itemSize = 4;
    points.vertexColorBuffer.numItems = points.colors.length / 4;
	
    return points;
}

function CreateStar3D(r, color_data, points)
{
	var star = {};
	
	var vertices = [
		0,  -1,  0,  	//0
		-1,  0,  0,		//1
		1,   0,  0,		//2
		0,   1,  0,		//3
		0,   0, -1,		//4
		0, 	 0,  1		//5
	];
	
	var indices = [
		0, 1, 5,
		0, 5, 2,
		5, 1, 3,
		5, 3, 2,
		0, 4, 1,
		0, 2, 4,
		4, 3, 1,
		4, 2, 3,
	];
	
	var colors = [];
	
	//Create the colors
	for(var i = 0; i < vertices.length / 3; i++)
	{
		colors.push(color_data[0] + color_data[3] * Math.random());
		colors.push(color_data[1] + color_data[3] * Math.random());
		colors.push(color_data[2] + color_data[3] * Math.random());
		colors.push(1.0);
	}
		
	//Create the vertex buffer
	star.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, star.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

	//Specify the vertex data size
	star.vertexPositionBuffer.itemSize = 3;
	star.vertexPositionBuffer.numItems = vertices.length / 3;

	//Create the index buffer
	star.vertexIndexBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, star.vertexIndexBuffer);
	webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), webgl.STATIC_DRAW);
	star.vertexIndexBuffer.itemSize = 1;
	star.vertexIndexBuffer.numItems = indices.length;

	//Create the color buffer
	star.vertexColorBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, star.vertexColorBuffer);

	//Copy the colors	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW);	

	//Specify the color data size
	star.vertexColorBuffer.itemSize = 4;
    star.vertexColorBuffer.numItems = colors.length / 4;
	
    return star;
}

function CreateOrbit(color_data, vertices)
{
	var orbit = {};
	var colors = [];
	//Create the colors
	for(var i = 0; i < vertices.length / 3; i++)
	{
		colors.push(color_data[0] + color_data[3] * Math.random());
		colors.push(color_data[1] + color_data[3] * Math.random());
		colors.push(color_data[2] + color_data[3] * Math.random());
		colors.push(1.0);
	}
		
	//Create the vertex buffer
	orbit.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, orbit.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

	//Specify the vertex data size
	orbit.vertexPositionBuffer.itemSize = 3;
	orbit.vertexPositionBuffer.numItems = vertices.length / 3;

	//Create the index buffer
	/*
	orbit.vertexIndexBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, orbit.vertexIndexBuffer);
	webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), webgl.STATIC_DRAW);
	orbit.vertexIndexBuffer.itemSize = 1;
	orbit.vertexIndexBuffer.numItems = indices.length;
	*/

	//Create the color buffer
	orbit.vertexColorBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, orbit.vertexColorBuffer);

	//Copy the colors	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW);	

	//Specify the color data size
	orbit.vertexColorBuffer.itemSize = 4;
    orbit.vertexColorBuffer.numItems = colors.length / 4;
	
    return orbit;
}

function CreateStar2D(r, color_data, points)
{
	var star = {};
	star.vertices = [];
	star.indices = [];
	star.colors = [];
	
	var count = points;
	var max = Math.PI * 2;
	var inc = (Math.PI * 2) / count;
	
	if(points % 2 == 0)
	{
		count /= 2;
		max /= 2;
		//inc /= 2;
	}
	
	for(var a = 0; a <= max; a += inc)
	{		
		//Create the indices
		star.indices.push(star.vertices.length / 3 + 0);
		star.indices.push(star.vertices.length / 3 + 1);
		star.indices.push(star.vertices.length / 3 + 2);

		if(points % 2 == 0)
		{
			star.indices.push(star.vertices.length / 3 + 0);
			star.indices.push(star.vertices.length / 3 + 3);
			star.indices.push(star.vertices.length / 3 + 2);
		}
		
		//Create the vertices		
		//0
		star.vertices.push(Math.cos(a - Math.PI / 2) * (r / 2));
		star.vertices.push(Math.sin(a - Math.PI / 2) * (r / 2));
		star.vertices.push(0);		
		//1
		star.vertices.push(Math.cos(a) * r);
		star.vertices.push(Math.sin(a) * r);
		star.vertices.push(0);	
		//2
		star.vertices.push(Math.cos(a + Math.PI / 2) * (r / 2));
		star.vertices.push(Math.sin(a + Math.PI / 2) * (r / 2));
		star.vertices.push(0);	
		
		if(points % 2 == 0)
		{
			//3
			star.vertices.push(Math.cos(a) * -r);
			star.vertices.push(Math.sin(a) * -r);
			star.vertices.push(a / 100);	
		}
		
		//Create the colors
		for(var i = 0; i < 4 - points % 2; i++)
		{
			//Add the color variance to the points
			if(i == 1 || i == 3)
			{
				star.colors.push(color_data[0]);
				star.colors.push(color_data[1]);
				star.colors.push(color_data[2]);
				star.colors.push(1.0);
			}
			else
			{
				star.colors.push(color_data[0] + color_data[3]);
				star.colors.push(color_data[1] + color_data[3]);
				star.colors.push(color_data[2] + color_data[3]);
				star.colors.push(1.0);
			}
		}
	}
	
	//Create the vertex buffer
	star.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, star.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(star.vertices), webgl.STATIC_DRAW);

	//Specify the vertex data size
	star.vertexPositionBuffer.itemSize = 3;
	star.vertexPositionBuffer.numItems = star.vertices.length / 3;

	//Create the index buffer
	star.vertexIndexBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, star.vertexIndexBuffer);
	webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(star.indices), webgl.STATIC_DRAW);
	star.vertexIndexBuffer.itemSize = 1;
	star.vertexIndexBuffer.numItems = star.indices.length;

	//Create the color buffer
	star.vertexColorBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, star.vertexColorBuffer);

	//Copy the colors	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(star.colors), webgl.STATIC_DRAW);	

	//Specify the color data size
	star.vertexColorBuffer.itemSize = 4;
    star.vertexColorBuffer.numItems = star.colors.length / 4;
	
    return star;
}

function CreateSphereTextured(radius, texture)
{
	var latitudeBands = 30;
	var longitudeBands = 30;
		
	//Create the sphere
	var sphere = {};		
	sphere.texture = texture;
	
	//Create the vertices	
	var vertexPositionData = [];
	var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }
	
	//Create the indices
	var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }
	
	//Create the vertex buffer
	sphere.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, sphere.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertexPositionData), webgl.STATIC_DRAW);

	//Specify the vertex data size
	sphere.vertexPositionBuffer.itemSize = 3;
	sphere.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

	//Create the index buffer
	sphere.vertexIndexBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, sphere.vertexIndexBuffer);
	webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), webgl.STATIC_DRAW);
	sphere.vertexIndexBuffer.itemSize = 1;
	sphere.vertexIndexBuffer.numItems = indexData.length;

	//Create the textureCoords buffer
	sphere.textureBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, sphere.textureBuffer);

	//Copy the textureCoords	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(textureCoordData), webgl.STATIC_DRAW);	

	//Specify the textureCoords data size
	sphere.textureBuffer.itemSize = 2;
    sphere.textureBuffer.numItems = textureCoordData.length / 2;

	return sphere;
}


function CreateSphere(r, color_data)
{
	var color_r;
	var color_g;
	var color_b;
	var color_variance;
	
	if(color_data)
	{
		color_r = color_data[0];
		color_g = color_data[1];
		color_b = color_data[2];
		color_variance = color_data[3];
	}
	else
	{
		color_r = Math.random();
		color_g = Math.random();
		color_b = Math.random();
		color_variance = Math.random();
	}
	
	radius = r;
	//Create the sphere
	var sphere = {};	
	sphere.middlePointIndexCache = [];

	//Create the vertices
	sphere.vertices = [];

	var t = (1.0 + Math.sqrt(5.0)) / 2.0;

	AddSphereVertex(-1 * r,  t * r,  0, sphere.vertices);
	AddSphereVertex( 1 * r,  t * r,  0, sphere.vertices);
	AddSphereVertex(-1 * r, -t * r,  0, sphere.vertices);
	AddSphereVertex( 1 * r, -t * r,  0, sphere.vertices);

	AddSphereVertex( 0, -1 * r,  t * r, sphere.vertices);
	AddSphereVertex( 0,  1 * r,  t * r, sphere.vertices);
	AddSphereVertex( 0, -1 * r, -t * r, sphere.vertices);
	AddSphereVertex( 0,  1 * r, -t * r, sphere.vertices);

	AddSphereVertex( t * r,  0, -1 * r, sphere.vertices);
	AddSphereVertex( t * r,  0,  1 * r, sphere.vertices);
	AddSphereVertex(-t * r,  0, -1 * r, sphere.vertices);
	AddSphereVertex(-t * r,  0,  1 * r, sphere.vertices);

	// create 20 triangles of the icosahedron
	sphere.indices = [

		// 5 faces around point 0
		0, 11, 5,
		0, 5, 1,
		0, 1, 7,
		0, 7, 10,
		0, 10, 11,

		// 5 adjacent faces 
		1, 5, 9,
		5, 11, 4,
		11, 10, 2,
		10, 7, 6,
		7, 1, 8,

		// 5 faces around point 3
		3, 9, 4,
		3, 4, 2,
		3, 2, 6,
		3, 6, 8,
		3, 8, 9,

		// 5 adjacent faces 
		4, 9, 5,
		2, 4, 11,
		6, 2, 10,
		8, 6, 7,
		9, 8, 1
	];

	//alert("Start");

	// refine triangles
	var recursionLevel = 3;
	for (i = 0; i < recursionLevel; i++)
	{
		//console.break();
		var faces2 = [];
		for(j = 0; j < sphere.indices.length; j += 3)
		{
			// replace triangle by 4 triangles
			var a = getMiddlePoint(sphere.indices[j], sphere.indices[j+1], sphere);
			var b = getMiddlePoint(sphere.indices[j+1], sphere.indices[j+2], sphere);
			var c = getMiddlePoint(sphere.indices[j+2], sphere.indices[j], sphere);

			faces2.push(sphere.indices[j])
			faces2.push(a);
			faces2.push(c);

			faces2.push(sphere.indices[j+1])
			faces2.push(b);
			faces2.push(a);

			faces2.push(sphere.indices[j+2]);
			faces2.push(c);
			faces2.push(b);
			
			faces2.push(a);
			faces2.push(b);
			faces2.push(c);
		}
		sphere.indices = faces2;
	}

	//Create the vertex buffer
	sphere.vertexPositionBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, sphere.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(sphere.vertices), webgl.STATIC_DRAW);

	//Specify the vertex data size
	sphere.vertexPositionBuffer.itemSize = 3;
	sphere.vertexPositionBuffer.numItems = sphere.vertices.length / 3;

	//Create the index buffer
	sphere.vertexIndexBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, sphere.vertexIndexBuffer);
	webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.indices), webgl.STATIC_DRAW);
	sphere.vertexIndexBuffer.itemSize = 1;
	sphere.vertexIndexBuffer.numItems = sphere.indices.length;

	//Create the colors
	sphere.colors = [];
	for(var i = 0; i < sphere.vertices.length; i++)
	{
		sphere.colors.push(color_r + Math.random() * color_variance);
		sphere.colors.push(color_g + Math.random() * color_variance);
		sphere.colors.push(color_b + Math.random() * color_variance);
		sphere.colors.push(1.0);
	}

	//Create the color buffer
	sphere.vertexColorBuffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, sphere.vertexColorBuffer);

	//Copy the colors	
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(sphere.colors), webgl.STATIC_DRAW);	

	//Specify the color data size
	sphere.vertexColorBuffer.itemSize = 4;
    sphere.vertexColorBuffer.numItems = sphere.colors.length / 4;
	
    return sphere;
}

function AddSphereVertex(x, y , z, vertexArray)
{
	//var r = 5.1;
	var length = Math.sqrt(x * x + y * y + z * z);
	vertexArray.push(x / length * radius);
	vertexArray.push(y / length * radius);
	vertexArray.push(z / length * radius);	
}

// return index of point in the middle of p1 and p2
function getMiddlePoint(p1, p2, sphere)
{
	// first check if we have it already
	var firstIsSmaller = p1 < p2;
	var smallerIndex = firstIsSmaller ? p1 : p2;
	var greaterIndex = firstIsSmaller ? p2 : p1;
	//var key = (smallerIndex << 32) + greaterIndex;
	var key = smallerIndex + "_" + greaterIndex;

	var ret;
	if (sphere.middlePointIndexCache[key])
	{
	    return sphere.middlePointIndexCache[key];
	}

	// not in cache, calculate it
	var point1 = [sphere.vertices[p1 * 3], sphere.vertices[p1 * 3 + 1], sphere.vertices[p1 * 3 + 2]];
	var point2 = [sphere.vertices[p2 * 3], sphere.vertices[p2 * 3 + 1], sphere.vertices[p2 * 3 + 2]];
	var middle = [
	    (point1[0] + point2[0]) / 2.0, 
	    (point1[1] + point2[1]) / 2.0, 
	    (point1[2] + point2[2]) / 2.0
	];

	// add vertex makes sure point is on unit sphere
	AddSphereVertex(middle[0], middle[1], middle[2], sphere.vertices); 
	var newPoint = (sphere.vertices.length - 3) / 3;
	// store it, return index
	sphere.middlePointIndexCache[key] = newPoint;
	return newPoint;
}

function setMatrixUniforms() 
{
	webgl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	webgl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function setMatrixUniformsTextured() 
{
	webgl.uniformMatrix4fv(shaderProgramTextured.pMatrixUniform, false, pMatrix);
	webgl.uniformMatrix4fv(shaderProgramTextured.mvMatrixUniform, false, mvMatrix);
}


function UpdateTrail()
{	
	if(ticks % trailInterval == 0)
	{
		if(this.trail.length >= trailLength)
		{
			this.trail.splice(0, 3);
		}
		
		this.trail.push(this.position[0]);
		this.trail.push(this.position[1]);
		this.trail.push(this.position[2]);
		
		this.trailModel = CreateOrbit(this.color, this.trail);
	}
	
	//if(ticks % (trailInterval * 2) == 0)
	//{
	//	this.trailModel = CreateOrbit(this.color, this.trail);
	//}
}

function DrawVector()
{
    var velocityVector = vec3.create();
	vec3.set(this.motion, velocityVector);
	vec3.normalize(velocityVector);
	vec3.scale(velocityVector, this.radius, velocityVector);

	var velocityVector2 = vec3.create();
	vec3.set(this.motion, velocityVector2);
	vec3.scale(velocityVector2, vectorLength);
	vec3.add(velocityVector, velocityVector2);
	vec3.add(velocityVector, this.position, velocityVector);

    var accVector = vec3.create();
	vec3.set(this.acceleration, accVector);
	vec3.normalize(accVector);
	vec3.scale(accVector, this.radius, accVector);

	var accVector2 = vec3.create();
	vec3.set(this.acceleration, accVector2);
	vec3.scale(accVector2, vectorLength);
	vec3.scale(accVector2, vectorAcclBoost);
	vec3.add(accVector, accVector2);
	vec3.add(accVector, this.position, accVector);

	var vertex = [
		this.position[0],
		this.position[1],
		this.position[2],
		velocityVector[0],
		velocityVector[1],
		velocityVector[2],
		this.position[0],
		this.position[1], 
		this.position[2],
		accVector[0],
		accVector[1],
		accVector[2],
		];
	webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vectorModel.vertexPositionBuffer);	

	//Copy the vertices into the buffer
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertex), webgl.STATIC_DRAW);
		
	//Point webgl to the vertex attribute
	webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vectorModel.vertexPositionBuffer.itemSize, webgl.FLOAT, false, 0, 0);
	
	//Bind to the color buffer
	webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vectorModel.vertexColorBuffer);

	//Point webgl to the color attribute
	webgl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.vectorModel.vertexColorBuffer.itemSize, webgl.FLOAT, false, 0, 0);

	//Copy the uniforms to the shder program
	setMatrixUniforms();

	//Draw the object
	webgl.drawArrays(webgl.LINES, 0, this.vectorModel.vertexPositionBuffer.numItems);
}

function Resize()
{
	if(webgl)
	{
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		webgl.viewportWidth = canvas.width;
		webgl.viewportHeight = canvas.height;
		aspectRatio = webgl.viewportWidth / webgl.viewportHeight;
	}
}









