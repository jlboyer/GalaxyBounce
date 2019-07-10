const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.cursor = 'none';

class Attractor {
  constructor(x, y){
    this.centerX = x;
    this.centerY = y;
    this.radius = Math.random()*20 + 10;
    this.attractK = 1000;
    this.satellites = [];
    this.color = 'rgba(255, 255, 255, 1)'
  } 
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke()
    this.drawSatellites()
  }
  drawSatellites(){
    this.satellites.forEach((satellite, index, array) => {
      //satellite.updatePosition()
      satellite.draw()
      satellite.drawAttractVector()
      //satellite.drawTangentVector()
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
    this.forcingAngularVelocity = 0.1*2*Math.PI*(1/60) //
    this.velocityX = 0; 
    this.velocityY = 0; //set an initial velocity to start orbit
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.attractorVectorX = 0;
    this.attractorVectorY = 0;
    this.naturalOrbit = r;
    this.thetaRads = 0; //update based on satellite position
    this.mass = 1;
    this.color = 'rgba(255,255,255,1)'
    this.damping = 1;
  }
  draw(){
    this.updatePosition()
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2
    ctx.stroke()
  }
  drawAttractVector(){
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

    if (this.attractorVectorX < 0 && this.attractorVectorY > 0) {
      // quadrant I
      this.thetaRads = -Math.atan(this.attractorVectorY / this.attractorVectorX)
    } else if (this.attractorVectorX > 0 && this.attractorVectorY > 0) {
      //quadrant II
      this.thetaRads = Math.PI - Math.atan(this.attractorVectorY / this.attractorVectorX) 
    } else if (this.attractorVectorX > 0 && this.attractorVectorY < 0) {
      //quadrant III
      this.thetaRads = Math.PI - Math.atan(this.attractorVectorY / this.attractorVectorX)
    } else if (this.attractorVectorX < 0 && this.attractorVectorY < 0){
      //quadrant IV
      this.thetaRads = 2*Math.PI - Math.atan(this.attractorVectorY / this.attractorVectorX)
    }
    // this.thetaRads += this.forcingAngularVelocity
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
  }
  updateVelocity(){
    this.velocityX -= this.accelerationX * (1/60)  //60FPS?  V = V0 + A * t
    this.velocityY -= this.accelerationY * (1/60)
    
    //update velocity with forcing angular velocity 
    this.velocityX -= this.forcingAngularVelocity*this.naturalOrbit*Math.sin(this.thetaRads)
    this.velocityY -= this.forcingAngularVelocity*this.naturalOrbit*Math.cos(this.thetaRads)
    this.drawForcingVelocity()

    // this.velocityX = 0.9*this.velocityX
    // this.velocityY = 0.9*this.velocityY
  }
  drawForcingVelocity(){
    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = -this.forcingAngularVelocity*this.naturalOrbit*Math.sin(this.thetaRads)*100
    let vectorY = -this.forcingAngularVelocity*this.naturalOrbit*Math.cos(this.thetaRads)*100
    ctx.lineTo(this.centerX+vectorX, this.centerY+vectorY)
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = '18px sans-serif'
    ctx.fillText(`${Math.round(this.thetaRads*(180/Math.PI))}-degrees \n Forcing-Vector-X:${vectorX.toFixed(2)}, Forcing-Vector-Y:${vectorY.toFixed(2)}`,50,50)
  }
  updateAcceleration(){
    let parentAttractorK = game.attractors[this.parentAttractorIndex].attractK
    let attractorVectorMag = Math.sqrt(Math.pow(this.attractorVectorX,2) + Math.pow(this.attractorVectorY,2))
    let attractorUnitVectorX = this.attractorVectorX / attractorVectorMag
    let attractorUnitVectorY = this.attractorVectorY / attractorVectorMag

    let attractorSpringForce = parentAttractorK * (this.naturalOrbit - attractorVectorMag ) // Fspring = k*delta(x)
    
    ctx.fillText(`${attractorSpringForce}`, 50, 150)
    this.accelerationX = (attractorSpringForce * attractorUnitVectorX) / this.mass // F = m*a 
    this.accelerationY = (attractorSpringForce * attractorUnitVectorY) / this.mass

    if (this.thetaRads > 0 && this.thetaRads <= Math.PI / 2) {
      //Quadrant I
      this.accelerationX -= ( this.damping * this.velocityX * Math.cos(this.thetaRads)) / this.mass
      this.accelerationY -= ( this.damping * this.velocityY * Math.sin(this.thetaRads)) / this.mass
    } else if (this.thetaRads > Math.PI / 2 && this.thetaRads <= Math.PI) {
      //Quadrant II
      this.accelerationX += ( this.damping * this.velocityX * Math.cos(this.thetaRads)) / this.mass
      this.accelerationY -= ( this.damping * this.velocityY * Math.sin(this.thetaRads)) / this.mass
    } else if (this.thetaRads > Math.PI && this.thetaRads <= 3 * Math.PI / 2) {
      //Quadrant III
      this.accelerationX += ( this.damping * this.velocityX * Math.cos(this.thetaRads)) / this.mass
      this.accelerationY += ( this.damping * this.velocityY * Math.sin(this.thetaRads)) / this.mass
    } else if (this.thetaRads > 3 * Math.PI / 2 && this.thetaRads < 2 * Math.PI){
      this.accelerationX -= ( this.damping * this.velocityX * Math.cos(this.thetaRads)) / this.mass
      this.accelerationY += ( this.damping * this.velocityY * Math.sin(this.thetaRads)) / this.mass
    }

    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = this.accelerationX 
    let vectorY = this.accelerationX 
    ctx.lineTo(this.centerX+vectorX, this.centerY+vectorY)
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2
    ctx.stroke()
    
    // this.accelerationX = ((attractorSpringForce - this.damping * this.velocityX) * attractorUnitVectorX) / this.mass // F = m*a 
    // this.accelerationX = ((attractorSpringForce - this.damping * this.velocityY) * attractorUnitVectorX) / this.mass 

    //add damping to spring force only in direction of attractor
    // this.accelerationX -= this.damping * Math.cos(this.thetaRads) * this.velocityX / this.mass
    // this.accelerationY -= this.damping * Math.sin(this.thetaRads) * this.velocityY / this.mass
    this.drawDamping()
  }
  drawDamping(){
    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = this.damping * Math.cos(this.thetaRads) * this.velocityX / this.mass
    let vectorY = -this.damping * Math.sin(this.thetaRads) * this.velocityY / this.mass
    ctx.lineTo(this.centerX+vectorX, this.centerY+vectorY)
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = '18px sans-serif'
    ctx.fillText(`cos:${Math.cos(this.thetaRads).toFixed(1)}, sin: ${Math.sin(this.thetaRads).toFixed(1)}, vel-x:${this.velocityX.toFixed(1)}, vel-y:${this.velocityY.toFixed(1)}`,50,100)
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
