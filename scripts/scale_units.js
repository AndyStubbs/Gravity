function ScaleG(value)
{
	return value * gGlobalScale;
}

function UnScaleG(value)
{
	return value / gGlobalScale;
}

//value is in kg
function ScaleMass(value)
{
	return value / Math.pow(gGlobalScale, 4);
}

function UnScaleMass(value)
{
	return value * Math.pow(gGlobalScale, 4);
}

//value is in m
function ScaleDistance(value)
{
	return value / gGlobalScale;
}

function UnScaleDistance(value)
{
	return value * gGlobalScale;
}

//X, Y, Z, VX, VY, VZ,
function ReadNasaData(data)
{
	var position = vec3.create();
	position[0] = ScaleDistance(data[0] * 1000);
	position[1] = ScaleDistance(data[2] * 1000);
	position[2] = ScaleDistance(-data[1] * 1000);
	var motion = vec3.create();
	motion[0] = ScaleDistance(data[3] * 1000);
	motion[1] = ScaleDistance(data[5] * 1000);
	motion[2] = ScaleDistance(-data[4] * 1000);
	return {
		position: position,
		motion: motion			
	};
}