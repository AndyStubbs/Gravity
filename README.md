# Gravity

A **3D Gravity and Planet Simulator** built with **HTML5, WebGL, and Vanilla JavaScript**. This lightweight project simulates gravitational interactions and elastic collisions between objects in a 3D space. It includes intuitive mouse controls for navigating the simulation, offering a dynamic and interactive experience.

## Features
- Realistic gravitational physics.
- Elastic collisions between objects.
- Visualization of orbital paths.
- Interactive camera controls using the mouse:
	- Drag to rotate the camera around a fixed point.
	- Camera always focuses on the central point of the simulation.
	- Mouse wheel to zoom in and out.
- Explosive effects to destroy planets.
- Pause, resume, and reset functionality.

## How to Use

### Controls
- Mouse Drag: Left/Right to change Angle, Up/Down to change Zoom
- Mouse Scroll: Change the height of the camera
- Settings Box:
   * Time Factor
   * Camera style
   * Object/Planet settings
   * Create new objects/planets

## Try Online
You can run the demo online at:  
[Gravity on Andy's Web Games](https://andyswebgames.com/apps/gravity/)

## Local Setup

1. Clone or download the repository:
   ```bash
   git https://github.com/AndyStubbs/Gravity.git
   cd Gravity
   ```
2. Setup a local server. (Some examples work without this but the demo's with texture mapping won't work without the server)
3. Run the index.html on your local browser.

## Fun Example

1. Select the photo link.
2. Pause the simulation
3. Create some planets, update x,y,z to move them apart
4. Resume simulation
5. Watch photo turn into particles that get sucked up by objects/planets

## Fun Example 2

1. Select the explosions link.
2. Rotate camera to the right (drag left) so you can see all the planets.
3. Select the sun.
4. Explode the sun.
5. Watch explosions chain reaction.
