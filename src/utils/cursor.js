import * as THREE from 'three'
import EventEmitter from './eventEmitter.js'
import Experience from '../sceneComponents/experience/experience.js'

class Cursor extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()

        // console.log(this.experience)
        this.cameraGroup = this.experience.camera.cameraGroup
        this.deltaTime = this.experience.time.delta / 1000

        this.parallaxCoords = {x: 0, y: 0}
        this.mouse = new THREE.Vector2()
        this.followMouse = new THREE.Vector2()
        this.previousMouse = new THREE.Vector2()
        this.ease = 0.075

        this.velocity = 0
        this.targetVelocity = 0

        window.addEventListener('mousemove', this.handleMouse.bind(this))
        this.experience.time.on('tick', this.handleTick.bind(this)) 
    }

    handleMouse(event) {
        this.parallaxCoords.x = event.clientX / this.experience.sizes.width - 0.5
        this.parallaxCoords.y = event.clientY / this.experience.sizes.height - 0.5

        this.mouse.x = event.clientX / this.experience.sizes.width
        this.mouse.y = 1.0 - (event.clientY / this.experience.sizes.height)
        // console.log(this.parallaxCoords)
    }

    handleTick () {
        this.calculateSpeed()
        this.determineParallax()
    }

    calculateSpeed() {
        this.velocity = Math.sqrt( (this.previousMouse.x - this.mouse.x)**2 + (this.previousMouse.y - this.mouse.y)**2)
        
        this.targetVelocity -= this.ease * (this.targetVelocity - this.velocity)
        this.followMouse.x -= this.ease * (this.followMouse.x - this.mouse.x)
        this.followMouse.y -= this.ease * (this.followMouse.y - this.mouse.y)

        // console.log(this.followMouse)

        this.previousMouse.x = this.mouse.x
        this.previousMouse.y = this.mouse.y
    }

    determineParallax() {
        const parallaxCoords = this.parallaxCoords
        const parallaxX = parallaxCoords.x * 0.3
        const parallaxY = - parallaxCoords.y * 0.3

        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * this.deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * this.deltaTime

    }

    


}

export default Cursor