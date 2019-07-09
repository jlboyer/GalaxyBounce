const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.cursor = 'none';

class Attractor {
  constructor(x, y){
    this.centerX = x;
    this.centerY = y;
    this.radius = Math.random()*10 + 10;
    this.attractK = 10;
    this.satellites = [];
  } 
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
    this.drawSatellites()
  }
  drawSatellites(){
    this.satellites.forEach((satellite, index, array) => {
      //satellite.updatePosition()
      satellite.draw()
      satellite.drawAttractVector()
      satellite.drawTangentVector()
      satellite.drawSiblingVector(array.slice(index))
    })
  }
}

class Satellite {
  constructor(x , y , r){
    this.parentAttractorIndex = 0;
    this.radius = 10;
    this.centerX = x;
    this.centerY = y;
    this.velocityX = 0; //satellites spawn +x from attractor so sets in motion clockwise
    this.velocityY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.attractorVectorX = 0;
    this.attractorVectorY = 0;
    this.naturalOrbit = r;
    this.thetaRads = 0; //update based on satellite position
    this.mass = 1;
  }
  draw(){
    this.updatePosition()
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
  drawAttractVector(){
    // this.setAttractorVector()

    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)

    ctx.lineTo(this.centerX+this.attractorVectorX,this.centerY+this.attractorVectorY)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
  setAttractorVector(){
    this.attractorVectorX = game.attractors[this.parentAttractorIndex].centerX - this.centerX
    this.attractorVectorY = game.attractors[this.parentAttractorIndex].centerY - this.centerY
    this.thetaRads = Math.acos(this.attractorVectorX / Math.sqrt(Math.pow(this.attractorVectorX,2) + Math.pow(this.attractorVectorY,2)))
    // console.log(this.thetaRads)
  }
  drawTangentVector(){
    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = game.attractors[this.parentAttractorIndex].centerX - this.centerX
    let vectorY = game.attractors[this.parentAttractorIndex].centerY - this.centerY
    ctx.lineTo(this.centerX+vectorY, this.centerY-vectorX)
    ctx.strokeStyle = 'rgba(219, 10, 91, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
  drawSiblingVector(arrayOfSiblings){
      arrayOfSiblings.forEach( sibling => {
        ctx.beginPath()
        ctx.moveTo(this.centerX,this.centerY)
        let vectorX = sibling.centerX - this.centerX
        let vectorY = sibling.centerY - this.centerY
        ctx.lineTo(this.centerX + vectorX, this.centerY + vectorY)
        ctx.strokeStyle = 'rgba(46, 49, 49, 1)'
        ctx.lineWidth = 2
        ctx.stroke()
      })
  }
  updatePosition(){
    this.setAttractorVector()
    this.updateAcceleration()
    this.updateVelocity()
    this.centerX += this.velocityX * (1/60) // X = X0 + V * t
    this.centerY += this.velocityY * (1/60)

    // let parentAttractor = game.attractors[this.parentAttractorIndex]
    // this.centerX = parentAttractor.centerX + this.naturalOrbit
    // this.centerY = parentAttractor.centerY
    // //update velocity by acceleration

    // //update position by velocity
  }
  updateVelocity(){
    //if satellite is closer than natural orbit spring force is positive 
    this.velocityX -= this.accelerationX * (1/60)  //60FPS?  V = V0 + A * t
    this.velocityY -= this.accelerationY * (1/60)
  }
  updateAcceleration(){
    let parentAttractorK = game.attractors[this.parentAttractorIndex].attractK
    let attractorVectorMag = Math.sqrt(Math.pow(this.attractorVectorX,2) + Math.pow(this.attractorVectorY,2))
    let attractorUnitVectorX = this.attractorVectorX / attractorVectorMag
    let attractorUnitVectorY = this.attractorVectorY / attractorVectorMag

    let attractorSpringForce = parentAttractorK * (this.naturalOrbit - attractorVectorMag ) // Fspring = k*delta(x)
    
    this.accelerationX = (attractorSpringForce * attractorUnitVectorX) / this.mass // F = m*a 
    this.accelerationY = (attractorSpringForce * attractorUnitVectorY) / this.mass
  }
}



const game = {
  mouseX: 0,
  mouseY: 0,
  attractors: [],
  activeAttractorIndex: 0,
  initialize(){
    
    document.onmousemove = (evt) => {
      game.mouseX = this.getMousePos(canvas, evt).x
      game.mouseY = this.getMousePos(canvas, evt).y
    }
    
    let attractor = new Attractor(this.mouseX,this.mouseY)
    this.attractors.push(attractor)

    document.onclick = () => {
      let attractorSatCount = game.attractors[this.activeAttractorIndex].satellites.length
      let orbitRadius = game.attractors[this.activeAttractorIndex].radius*3*(1+attractorSatCount)
      let satellite = new Satellite(game.mouseX + orbitRadius , game.mouseY, orbitRadius)
      satellite.parentAttractorIndex = this.activeAttractorIndex
      game.attractors[this.activeAttractorIndex].satellites.push(satellite)
    }

    document.onkeydown = (evt) => {
      //Spacebar creates a new attractor and makes this the active attractor
      //KeyDown cycles the active attractor index 
 
      switch (evt.code) {
        case "Space":
          let attractor = new Attractor(this.mouseX,this.mouseY)
          this.attractors.push(attractor)
          this.activeAttractorIndex = this.attractors.length - 1
          break;
        case "ArrowDown":
          if (this.activeAttractorIndex === 0) {
            this.activeAttractorIndex = this.attractors.length - 1
          } else {
            this.activeAttractorIndex--
          }
          break;
        case "ArrowUp":
          if (this.activeAttractorIndex + 1 === this.attractors.length) {
            this.activeAttractorIndex = 0
          } else {
            this.activeAttractorIndex++
          }
          break;
        default:
          break;
      }
    }


    this.animate()
  },
  animate(){
    game.clearCanvas()

    //Only the active attractor follows the mouse
    game.attractors[game.activeAttractorIndex].centerX = game.mouseX
    game.attractors[game.activeAttractorIndex].centerY = game.mouseY
    game.attractors.forEach(attractor => attractor.draw())

    window.requestAnimationFrame(game.animate)
  },
  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)  
  },
  getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}


game.initialize()
