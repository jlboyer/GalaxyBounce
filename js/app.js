  class Ship {
  constructor() {
    this.lives = 5;
    this.score = 0;
    this.parentPlanet = {};
    this.radius = 8;
    this.centerX = 130;
    this.centerY = 375;
    this.orbiting = true;
    this.clockwise = 1;
    this.orbitRadius = 45;
    this.orbitFreq = 30;
    this.angularVelocity = 2 * Math.PI * this.orbitFreq;
    this.rotationAngle = 0;
    this.vX = 0;
    this.vY = 0;
    this.vAdjust = 1 / 13.5;
  }
  updateRotationAngle() {
    this.rotationAngle =
      this.angularVelocity * (1 / 60) * game.time.getSeconds() +
      this.angularVelocity * (1 / 60000) * game.time.getMilliseconds();
  }
  updateLinearVel() {
    let cosTheta = Math.cos(this.rotationAngle);
    let sinTheta = Math.sin(this.rotationAngle);
    this.vX = -this.angularVelocity * sinTheta * this.vAdjust;
    this.vY = this.angularVelocity * cosTheta * this.vAdjust;
  }
  orbit() {
    this.centerX =
      this.orbitRadius * Math.cos(this.rotationAngle) +
      this.parentPlanet.centerX;
    this.centerY =
      this.orbitRadius * Math.sin(this.rotationAngle) +
      this.parentPlanet.centerY;
  }
  draw() {
    if (this.orbiting === true) {
      this.updateRotationAngle();
      this.updateLinearVel();
      this.orbit();
    } else {
      this.launch();
    }

    game.ctx.beginPath();

    game.ctx.strokeStyle = "white";
    game.ctx.lineWidth = 2;
    game.ctx.arc(
      this.centerX,
      this.centerY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    game.ctx.stroke();
  }
  launch() {
    this.centerX +=
      this.vX * (1 / 60) * game.time.getSeconds() +
      this.vX * (1 / 60000) * game.time.getMilliseconds();
    this.centerY +=
      this.vY * (1 / 60) * game.time.getSeconds() +
      this.vY * (1 / 60000) * game.time.getMilliseconds();
    this.newOrbit();
    this.outOfBounds();
  }
  newOrbit() {
    game.planets.slice(1).forEach(planet => {
      if (planet !== this.parentPlanet) {
        let minX = planet.centerX - 1.5 * this.orbitRadius;
        let maxX = planet.centerX + 1.5 * this.orbitRadius;
        let minY = planet.centerY - 1.5 * this.orbitRadius;
        let maxY = planet.centerY + 1.5 * this.orbitRadius;
        if (
          this.centerX > minX &&
          this.centerX < maxX &&
          this.centerY > minY &&
          this.centerY < maxY
        ) {
          this.parentPlanet = planet;
          this.orbiting = true;
          this.clockwise = this.isClockwise();
          this.score++;
          $(`#player${game.currentPlayer + 1}-orbs`).toggleClass("pulse");
          planet.hit = true;
        }
      }
    });
  }
  isClockwise() {
    let strikeVector = [
      this.parentPlanet.centerX - this.centerX,
      this.parentPlanet.centerY - this.centerY
    ];

    let crossProduct = this.vY * strikeVector[0] + this.vX * strikeVector[1];
    if (crossProduct > 0) {
      return 1;
    } else {
      this.angularVelocity = -1 * 2 * Math.PI * this.orbitFreq;
      return -1;
    }
  }
  outOfBounds() {
    if (
      this.centerX > canvas.width + 2 * game.planets[0].radius ||
      this.centerY > canvas.height + 2 * game.planets[0].radius ||
      this.centerX + 2 * game.planets[0].radius < 0 ||
      this.centerY + 2 * game.planets[0].radius < 0
    ) {
      //reset player location to starting orbit and decrement life
      game.ships[game.currentPlayer].orbiting = true;
      game.ships[game.currentPlayer].centerX = 130;
      game.ships[game.currentPlayer].centerY = 375;
      game.ships[game.currentPlayer].lives -= 1;
      game.currentPlayer = Math.abs(game.currentPlayer - 1);
      $(`#player${game.currentPlayer + 1}-name`).toggleClass("pulse");
    }
  }
}

class Planet {
  constructor(x = 80, y = 375) {
    this.centerX = x; //initialize with home will update for targets
    this.centerY = y;
    this.initialCenterX = x;
    this.initialCenterY = y;
    this.entryCenterX = x;
    this.entryCenterY = 0;
    this.radius = Math.random() * 20 + 10;
    this.color = "rgba(255, 255, 255, 1)";
    this.hit = false;
    this.orbitFreq = 0.07; //much slower than ship orbit
    this.angularVelocity = 2 * Math.PI * this.orbitFreq;
    this.rotationAngle = 0;
    this.firstIteration = true;
    this.timerStartAngle = 0;
    this.startSeconds = 0;
    this.startMilliseconds = 0;
    this.offTimeSeconds = 0;
    this.offTimeMilliseconds = 0;
    this.initOffTimeSeconds = 0;
    this.initOffTimeMilliseconds = 0;
    this.orbitRadius = 0;
    this.startAngleToHome = 0;
    this.orbitCount = 0;
    this.exitAngle = 0;
  }
  updateRotationAngle() {
    if (this.firstIteration === true) {
      this.startSeconds = game.time.getSeconds();
      this.startMilliseconds = game.time.getMilliseconds();
      this.firstIteration = false;
      this.initialCenterY = this.centerY
      this.initialCenterX = this.centerX
    }

      this.rotationAngle =
        this.angularVelocity *
        ((1 / 60) * (game.time.getSeconds() - this.startSeconds) +
          (1 / 60000) *
            (game.time.getMilliseconds() - this.startMilliseconds)) + this.startAngleToHome -this.orbitCount*this.exitAngle;
      
  }
  orbit() {
    this.centerX =
      this.orbitRadius * Math.cos(this.rotationAngle) + game.planets[0].centerX;
    this.centerY =
      this.orbitRadius * Math.sin(this.rotationAngle) + game.planets[0].centerY;

    // if it goes off the canvas reintroduce at top
    if (
      this.centerY > canvas.height + 2 * this.radius ||
      this.centerX + 2 * this.radius < 0
    ) {
      if (this.orbitCount === 3) {
        game.ships[0].parentPlanet = home;
        game.ships[1].parentPlanet = home;
        game.planets = [];
        game.planets.push(home);
        game.generateTargetPlanets();
      } else {
        this.exitAngle = this.rotationAngle
        this.orbitCount++;
        this.calcRewindTime();
      }
    }
  }
  calcRewindTime() {
    if (this.orbitCount === 1) {
      this.initOffTimeSeconds = game.time.getSeconds();
      this.initOffTimeMilliseconds = game.time.getMilliseconds();
    }
    let offTimeSeconds = game.time.getSeconds();
    let offTimeMilliseconds = game.time.getMilliseconds();
    this.offTimeSeconds =
      ((offTimeSeconds - this.startSeconds) /
        (game.canvas.height - this.initialCenterY)) *
      this.initialCenterY;
    this.offTimeMilliseconds =
      ((offTimeMilliseconds - this.startMilliseconds) /
        (game.canvas.height - this.initialCenterY)) *
      this.initialCenterY;
    this.startSeconds = offTimeSeconds;
    this.startMilliseconds = offTimeMilliseconds;
  }
  draw(i) {
    this.drawOrbit();
    if (i !== 0){
      this.updateRotationAngle();
      this.orbit();
    }

    game.ctx.beginPath();
    game.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    game.ctx.fillStyle = this.color;
    game.ctx.fill();
    game.ctx.strokeStyle = "white";
    game.ctx.lineWidth = 2;
    game.ctx.stroke();
  }
  drawOrbit() {
    let homeX = game.planets[0].centerX;
    let homeY = game.planets[0].centerY;
    game.ctx.strokeStyle = "rgba(255,255,255,0.5)";
    game.ctx.beginPath();
    game.ctx.arc(homeX, homeY, this.orbitRadius, 0, 2 * Math.PI);
    game.ctx.stroke();
  }
}

const game = {
  targetPlanetCount: 4,
  planets: [],
  ships: [],
  currentPlayer: 0,
  time: 0,
  animationID: null,
  canvas: null,
  ctx: null,
  initialize() {
    document.onclick = () => {
      game.ships[game.currentPlayer].orbiting = false;
    };

    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");

    const home = new Planet();
    home.hit = true;
    this.planets.push(home);

    let player1 = new Ship();
    player1.parentPlanet = home;
    this.ships.push(player1);

    let player2 = new Ship();
    player2.parentPlanet = home;
    this.ships.push(player2);

    this.generateTargetPlanets();

    this.animate();
  },
  generateTargetPlanets() {
    let i = 0;
    let radiusArray = [];
    let planetStartAngleArray = [];
    let planetCenterArray = [];

    while (i <= game.targetPlanetCount) {
      let radius =
        Math.random() * 0.8 * (canvas.width - game.planets[0].centerX) + 200;
      radius = Math.round(radius / 200) * 200; //round to nearest 200th
      if (radiusArray.indexOf(radius) === -1) {
        radiusArray.push(radius);
        i++;
      }
    }
    radiusArray.forEach(radius => {
      let startAngleToHome = -0.5 + Math.random();
      let centerX =
        radius * Math.cos(startAngleToHome) + game.planets[0].centerX;
      let centerY =
        radius * Math.sin(startAngleToHome) + game.planets[0].centerY;
      //if the above condition spawns a planet off board, move to top edge
      if (centerY < 0 || centerY > this.canvas.height) {
        centerX =
          Math.pow(radius, 2) /
          (Math.pow(this.planets[0].centerX, 2) +
            Math.pow(this.planets[0].centerY, 2));
        centerY = 0;
      }

      planetStartAngleArray.push(startAngleToHome);
      planetCenterArray.push([centerX, centerY]);
    });

    planetCenterArray.forEach((center, i) => {
      let planet = new Planet(center[0], center[1]);
      planet.startAngleToHome = planetStartAngleArray[i];
      planet.entryCenterX =
        Math.pow(radiusArray[i], 2) /
        (Math.pow(this.planets[0].centerX, 2) +
          Math.pow(this.planets[0].centerY, 2));
      planet.orbitRadius = radiusArray[i];
      game.planets.push(planet);
    });
  },
  clearCanvas() {
    game.ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.ctx.fillStyle = "rgba(1, 1, 1, 0.2)";
    game.ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  animate() {
    game.clearCanvas();

    //Generate gradient background --------------
    let bckgrd = game.ctx.createRadialGradient(110, 375, 0, 0, 375, 1200);
    bckgrd.addColorStop(0, "rgba(255, 0, 106, 0.800)");
    bckgrd.addColorStop(0.5, "rgba(134, 0, 252, 0.500)");
    bckgrd.addColorStop(1, "rgba(14, 185, 247, 0.000)");
    game.ctx.fillStyle = bckgrd;
    game.ctx.fillRect(0, 0, canvas.width, canvas.height);
    //-------------------------------------------

    game.time = new Date();

    game.ships[game.currentPlayer].draw();

    game.planets.forEach((planet, i) => {
      planet.draw(i);
    });

    game.displayScoreboard();
    game.overCheck();
    game.newRoundCheck();
    game.animationID = window.requestAnimationFrame(game.animate);
  },
  displayScoreboard() {
    $("#player1-sats").text(game.ships[0].lives.toString(10).padStart(2, "0"));
    $("#player1-orbs").text(game.ships[0].score.toString(10).padStart(2, "0"));
    $("#player2-sats").text(game.ships[1].lives.toString(10).padStart(2, "0"));
    $("#player2-orbs").text(game.ships[1].score.toString(10).padStart(2, "0"));
    if (game.currentPlayer === 0) {
      $("#player1-name").text("PLAYER 1 ⎋");
      $("#player2-name").text("PLAYER 2");
    } else {
      $("#player1-name").text("PLAYER 1");
      $("#player2-name").text("PLAYER 2 ⎋");
    }
  },
  overCheck() {
    if (game.ships[0].lives === 0 || game.ships[1].lives === 0) {
      $("#overlay").css("display", "block");
      $("#overlay").on("click", () => {
        if ($("#overlay").css("display") === "block") {
          game.ships[0].lives = 5
          game.ships[1].lives = 5
          game.ships[0].score = 0
          game.ships[1].score = 0
          game.planets.forEach(planet => {
            planet.hit = true 
            })
          
          $("#overlay").css("display", "none");
        }
      });
    }
  },
  newRoundCheck() {
    let newRound = true;
    game.planets.forEach(planet => {
      if (planet.hit === false) {
        newRound = false;
      }
    });
    if (newRound === true) {
      $("#game-title").toggleClass("pulse");
      let home = game.planets[0];
      game.ships[0].parentPlanet = home;
      game.ships[1].parentPlanet = home;
      game.planets = [];
      game.planets.push(home);
      game.generateTargetPlanets();
    }
  }
};

// game.initialize()

const start = () => {
  game.initialize()
  $("#instructions").css("display","none")
  document.removeEventListener("click", start)
}
document.addEventListener("click", start)
