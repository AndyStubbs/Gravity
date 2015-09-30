function Init_Images()
{
	G = ScaleG(6.67384E-11);
	var imageNames = [
	"img/sunmap.png",			// 0
	"img/mercurymap.png", 		// 1
	"img/venusmap.png", 		// 2
	"img/earthmap.png", 		// 3
	"img/moonmap.png", 			// 4
	"img/marsmap.png", 			// 5
       "img/jupitermap.png", 		// 6
	"img/saturnmap.png", 		// 7
	"img/saturnring.png", 		// 8
	"img/uranusmap.png", 		// 9
	"img/neptunemap.png", 		//10
	"img/plutomap.png", 		//11
	"img/ganymedemap.png", 		//12
	"img/titanmap.png", 		//13
	"img/callistomap.png", 		//14
	"img/iomap.png", 			//15
	"img/moonmap.png", 			//16
	"img/europamap.png", 		//17
	"img/tritonmap.png", 		//18
	"img/charonmap.png", 		//19
	];
	for (var i = 0; i < imageNames.length; i++) {
		images[i] = new Image();
		images[i].onload = Initialize2;
		images[i].src = imageNames[i];
	}
	imageTotal = imageNames.length;
	imageCount = 0;
	Draw = DrawTextured;
}

function Initialize2()
{
	imageCount++;
	if (imageCount == imageTotal)
	{
		movePlanets = MovePlanetsWithIntegrationAndCollisions;
		movePlanet = Integrate;

		Initialize_Final();
	}
}

function InitSolarSystem()
{
	var earthRotation = (Math.PI * 2) / 86400;
	var color = [.9, .9, 0, .05];
	var planet = CreatePlanetObjectTextured(ScaleDistance(6.963E8), ScaleMass(1.9891E30), color, images[0]);
	var data = [-1.074527859236894E+05, -3.792745880805518E+05, -8.134395078613515E+03,  1.089261691201304E-02, -7.469848271811307E-04, -2.428808629738027E-04,];
	var data2 = ReadNasaData(data);
	planet.name = "Sun";
	planet.angularVelocity[1] = earthRotation / 24.47;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.5, .3, .1, .1];
	var data = [-1.571795939073216E+07, -6.830470005843700E+07, -4.125769133361311E+06,  3.771002640349195E+01, -8.456460970734048E+00, -4.150100079149541E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(2440E3), ScaleMass(3.302E23), color, images[1]);
	planet.name = "Mercury";
	planet.position[0] = 35;
	planet.angularVelocity[1] = earthRotation / 87.97;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.6, .75, .3, .1];
	var data = [1.046677872880195E+08,  2.738168388224219E+07, -5.674644451956007E+06, -9.082624911097749E+00,  3.369386282624086E+01,  9.862698638506371E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(6051.8E3), ScaleMass(48.685E23), color, images[2]);
	planet.name = "Venus";
	planet.position[0] = 60;
	planet.angularVelocity[1] = earthRotation / 243;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [0, 0, .9, .1];
	var data = [-1.462422430263176E+08, -3.204724904496511E+07, -7.276906949634025E+03,  5.823505737751537E+00, -2.922328453464701E+01, -2.680998809925965E-04];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(6371.01E3), ScaleMass(5.9736E24), color, images[3]);
	planet.name = "Earth";
	planet.angularVelocity[1] = earthRotation;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.7, .7, .7, .1];
	var data = [-1.462648018905713E+08, -3.241482765163992E+07, 1.402389953715798E+04, 6.880031767136986E+00, -2.930004291803664E+01, 7.508268009619683E-02];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1737.53E3), ScaleMass(734.9E20), color, images[16]);
	planet.name = "Luna";
	planet.angularVelocity[1] = earthRotation / 27.321582;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.6, 0, 0, .1];
	var data = [2.004736054671616E+08,  6.615060638497030E+07, -3.538987749948966E+06, -6.688530589849557E+00,  2.506338564863069E+01,  6.893850105503173E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(3389.9E3), ScaleMass(6.4185E23), color, images[5]);
	planet.name = "Mars";
	planet.angularVelocity[1] = earthRotation * 1.03;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.7, .5, .3, .1];
	var data = [1.115146105945132E+08,  7.533624218308638E+08, -5.636347318017971E+06, -1.308330370837089E+01,  2.536499259180499E+00,  2.822545285405192E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(69911E3), ScaleMass(1898.13E24), color, images[6]);
	planet.name = "Jupiter";
	planet.angularVelocity[1] = earthRotation * 2.449;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [1.125596001840585E+08, 7.535876208398277E+08, -5.614397129507890E+06, -1.537419638117085E+01, 1.317772676659368E+01, 6.529001009873698E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(2634E3), ScaleMass(1482E20), color, images[12]);
	planet.name = "Ganymede";
	planet.angularVelocity[1] = earthRotation / 7.155;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [1.120581120315613E+08, 7.551591695466455E+08, -5.571832793915858E+06, -2.093812995773208E+01, 4.972729716263895E+00, 2.539702929799452E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(2403E3), ScaleMass(1076E20), color, images[14]);
	planet.name = "Callisto";
	planet.angularVelocity[1] = earthRotation / 16.689018;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [1.111263036058103E+08, 7.531950774542456E+08, -5.648194489119927E+06, -6.278040571922429E+00, -1.334672668306468E+01, -1.978475839004386E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1821.3E3), ScaleMass(893.3E20), color, images[15]);
	planet.name = "Io";
	planet.angularVelocity[1] = earthRotation / 1.769138;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [1.110407118683516E+08, 7.538411170234470E+08, -5.620763898685883E+06, -2.272787188800557E+01, -7.161184846958403E+00, -2.446291001311160E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1565E3), ScaleMass(479.7E20), color, images[17]);
	planet.name = "Europa";
	planet.angularVelocity[1] = earthRotation / 1.769138;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.9, .7, .5, .1];
	var data = [-1.168826820867704E+09, -8.871556444888457E+08, 6.194153928136459E+07, 5.314576130710445E+00, -7.718365381536824E+00, -7.678802666005238E-02];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(58232E3), ScaleMass(5.68319E26), color, images[7]);
	planet.name = "Saturn";
	planet.angularVelocity[1] = earthRotation * 2.353;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [-1.167942424012862E+09, -8.878949351417173E+08, 6.223545979593130E+07, 9.060748198955654E+00, -4.036858504480586E+00, -2.346533869759719E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(2575.5E3), ScaleMass(13.4553E22), color, images[13]);
	planet.name = "Titan";
	planet.angularVelocity[1] = earthRotation / 15.945421;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.6, .6, .6, .1];
	var data = [2.967651127666667E+09,  4.351476410250416E+08, -3.683087347160918E+07, -1.037929705973245E+00,  6.420542158577365E+00,  3.733445809229458E-02];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(25559E3), ScaleMass(86.8103E24), color, images[9]);
	planet.name = "Uranus";
	planet.angularVelocity[1] = earthRotation * 1.341;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [2.967874629802532E+09, 4.350481267276164E+08, -3.719099117913824E+07, -4.075568887198965E+00, 6.808202659928987E+00, -1.951675515490522E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(788.9E3), ScaleMass(35.27E20), color, images[18]);
	planet.name = "Titania";
	planet.angularVelocity[1] = earthRotation / 8.706;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [2.968166609637590E+09, 4.350724900954486E+08, -3.657082626471107E+07, 2.697370726228618E-01, 5.739579009251530E+00, -2.755734597703328E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(761.4E3), ScaleMass(30.14E20), color, images[18]);
	planet.name = "Oberon";
	planet.angularVelocity[1] = earthRotation / 13.463;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [0, 0, .8, .1];
	var data = [3.992634633382162E+09, -2.045052198455161E+09, -4.989908996821850E+07,  2.442312389532616E+00,  4.870511167797426E+00, -1.563381169101360E-01];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(24624E3), ScaleMass(102.41E24), color, images[10]);
	planet.name = "Neptune";
	planet.angularVelocity[1] = earthRotation * 1.257;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [3.992855915977876E+09, -2.045148847298000E+09, -5.015899046909893E+07, -2.379706288332057E-01, 1.556039699433636E+00, -1.205821931184188E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1352.6E3), ScaleMass(214.7E20), color, images[18]);
	planet.name = "Triton";
	planet.angularVelocity[1] = earthRotation / 5.876854;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);

	var color = [.9, .9, .9, .1];
	var data = [8.070929157871609E+08, -4.773462436063002E+09,  2.773296336610743E+08,  5.464595578322584E+00, -1.683630181758616E-01, -1.541103432085885E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1151E3), ScaleMass(1.314E22), color, images[11]);
	planet.name = "Pluto";
	planet.angularVelocity[1] = earthRotation / 6.39;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);


	/*
	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [1.302911357716872E+10, 5.284686165609630E+09, -3.260642260588901E+09, -5.834021949952314E-01, 1.585948822317003E+00, 1.569964812707144E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(1163E3), ScaleMass(16.7E21), color, images[18]);
	planet.name = "Eris";
	planet.angularVelocity[1] = earthRotation / 5.876854;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);
	*/

	/*var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [-1.168710509639997E+09, -8.876167252462983E+08, 6.216838804220739E+07, 1.356048046133656E+01, -6.361475570533807E+00, -1.563398640929332E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(764.5E3), ScaleMass(230.9E22), color, images[18]);
	planet.name = "Rhea";
	planet.angularVelocity[1] = earthRotation / 4.518;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);
	*/

	/*
	var color = [Math.random() * .8, Math.random() * .8, Math.random() * .8, .1];
	var data = [8.071072419599968E+08, -4.773452075961227E+09, 2.773212362874180E+08, 5.450681929361801E+00, -2.965131893076977E-01, -1.722954793646760E+00];
	var data2 = ReadNasaData(data);
	planet = CreatePlanetObjectTextured(ScaleDistance(593E3), ScaleMass(1.9E21), color, images[19]);
	planet.name = "Charon";
	planet.angularVelocity[1] = earthRotation / 6.38723;
	planet.position = data2.position;
	planet.motion = data2.motion;
	planets.push(planet);
	*/

	/////////////////////////
	// Create Saturns Rings
	/////////////////////////

	var tempCanvas = document.createElement('canvas');
	var tempctx = tempCanvas.getContext('2d');
	tempctx.drawImage(images[8], 0, 0);
	var imageData = tempctx.getImageData(0, 0, images[8].width, images[8].height);

	var numParticles = 50000;
	var rMin = planets[11].radius * 2;
	var rMax = planets[11].radius * 3;
	var inclination = 3;

	var vertices = [];
	var motions = [];
	var colors = [];
	var speed = (Math.PI * 2) / 9999000;

	for (var i = 0; i < numParticles; i++) {
		var r = Math.random() * (rMax - rMin) + rMin;
		var a = Math.random() * Math.PI * 2;
		var yOffset = (Math.random() * (rMax - rMin) / 8) - (rMax - rMin) / 16;
		var x = Math.cos(a) * r;
		var y = ((Math.cos(a) * r) / inclination) + yOffset;
		var z = Math.sin(a) * r;

		motions.push(planets[11]);
		motions.push(r);
		motions.push(a);
		motions.push(((rMax + 1) - r) * speed);
		motions.push(inclination);
		motions.push(yOffset);

		var distance = Math.sqrt(x * x + y * y + z * z);
		var pct_r = (distance - rMin) / (rMax - rMin);
		var imageX = Math.round(images[8].width * pct_r);
		var imageIndex = imageX * 4;

		if (imageIndex + 4 > imageData.data.length)
			imageIndex = imageData.data.length - 4;

		if (imageIndex < 0)
			imageIndex = 0;

		colors.push(imageData.data[imageIndex] / 256);
		colors.push(imageData.data[imageIndex + 1] / 256);
		colors.push(imageData.data[imageIndex + 2] / 256);
		colors.push(1);

		vertices.push(x + planets[11].position[0]);
		vertices.push(y + planets[11].position[1]);
		vertices.push(z + planets[11].position[2]);
	}

	fakePoints = CreatePoints(vertices, colors);
	fakePoints.motion = motions;
}