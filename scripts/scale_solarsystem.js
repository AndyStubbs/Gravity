//m is in times earth mass
function CalcMass(m)
{
	var ratio = (5.97219 * Math.pow(10, 24));
	return (m * ratio) / Math.pow(gGlobalScale, 4);
}

//value is in AU - (Averge istance from Earth to sun)
function CalcPosition(value)
{
	var ratio = 149597870691;
	return (ratio * value) / gGlobalScale;
}

//d is in km
function CalcRadius(d)
{
	return (d * 10E3) / gGlobalScale;
}