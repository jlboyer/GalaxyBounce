const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//canvas.style.cursor = 'none';

// save canvas state
ctx.save();

// Create gradient
let bckgrd = ctx.createRadialGradient(110, 375, 0, 0, 375, 1200);

// Add colors
bckgrd.addColorStop(0, "rgba(255, 0, 106, 1.000)");
bckgrd.addColorStop(0.5, "rgba(134, 0, 252, 0.500)");
bckgrd.addColorStop(1, "rgba(14, 185, 247, 0.000)");

// Fill with gradient
ctx.fillStyle = bckgrd;
ctx.fillRect(0, 0, canvas.width, canvas.height);

//restore original canvas state and save it again
ctx.restore();
ctx.save();
//Create effect to change color of ship by position
ctx.globalCompositeOperation = "exclusion";

class Ship {
  constructor() {
    this.parentPlanet = {};
    this.radius = 15;
    this.centerX = 130;
    this.centerY = 375;
    this.orbitRadius = 45;
    this.orbitFreq = 1;
    this.angularVelocity = 2 * Math.PI * this.orbitFreq;
    this.rotationAngle = 0;
    this.gradient = ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      this.radius
    );
    this.colorStop1 = "rgba(252, 224, 10, 1)";
    this.colorStop2 = "rgba(244, 33, 14, 0)";
  }
  updateRotationAngle() {
    this.rotationAngle =
      this.angularVelocity * ((2 * Math.PI) / 60) * time.getSeconds() +
      this.angularVelocity * ((2 * Math.PI) / 60000) * time.getMilliseconds();
  }
  updateCenter() {
    this.centerX =
      this.orbitRadius * Math.cos(this.rotationAngle) +
      this.parentPlanet.centerX;
    this.centerY =
      this.orbitRadius * Math.sin(this.rotationAngle) +
      this.parentPlanet.centerY;
  }
  draw() {
    ctx.beginPath();
    this.gradient.addColorStop(0, this.colorStop1);
    this.gradient.addColorStop(1, this.colorStop2);
    ctx.fillStyle = this.gradient;
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}

class Planet {
  constructor(x = 80, y = 375) {
    this.centerX = x; //initialize with home will update for targets
    this.centerY = y;
    this.radius = Math.random() * 20 + 10;
    this.color = "rgba(255, 255, 255, 1)";
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const game = {
  targetPlanetCount: 5,
  planets: [],
  ships: [],
  initialize() {
    const home = new Planet();
    this.planets.push(home);
    home.draw() //only for debug
    this.generateTargetPlanets();
  },
  generateTargetPlanets() {
    let planetCenterArray = this.makePlanetCenterArray();
    planetCenterArray.forEach(center => {
      let planet = new Planet(center[0], center[1]);
      planet.draw(); //only temp
      this.planets.push(planet);
    });
  },
  makePlanetCenterArray() {
    let quadDim = 50;
    const cols = canvas.width / quadDim;
    const rows = canvas.height / quadDim;
    let i = 0;
    let activeQuadArray = [];
    let planetCenterArray = [];
    //generate quads where target planets will originate
    while (i < this.targetPlanetCount) {
      let colIndx = Math.floor(Math.random() * cols);
      let rowIndx = Math.floor(Math.random() * rows);
      if (activeQuadArray.indexOf([colIndx, rowIndx]) === -1 && colIndx > 3 && colIndx < cols - 1 && rowIndx > 1 && rowIndx < rows - 1) {
        activeQuadArray.push([colIndx, rowIndx]);
        i++;
      }
    }
    activeQuadArray.forEach(quad => {
      let centerX = quad[0] * quadDim - 25;
      let centerY = quad[1] * quadDim - 25;
      planetCenterArray.push([centerX, centerY]);
    });
    return planetCenterArray;
  }
};

game.initialize();

// let ship = new Ship
// let home = new Planet
// ship.draw()
// home.draw()
