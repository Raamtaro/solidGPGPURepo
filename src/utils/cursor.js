import * as THREE from 'three'
import Sizes from './sizes.js'
import EventEmitter from './eventEmitter.js'

class Cursor extends EventEmitter {
    constructor(experience) {
        super()

        this.experience = experience

        console.log(this.experience)

        this.parallaxCoords = {x: 0, y: 0}
        this.mouse = new THREE.Vector2()
        this.followMouse = new THREE.Vector2()
        this.previousMouse = new THREE.Vector2()
        this.ease = 0.075

        this.velocity = 0
        this.targetVelocity = 0

        window.addEventListener('mousemove', (event) => {
            this.parallaxCoords.x = event.clientX / this.experience.sizes.width - 0.5
            this.parallaxCoords.y = event.clientY / this.experience.sizes.height - 0.5

            this.mouse.x = event.clientX / this.experience.sizes.width
            this.mouse.y = 1.0 - (event.clientY / this.experience.sizes.height)
        })
    }

    calculateSpeed() {
        this.velocity = Math.sqrt( (this.previousMouse.x - this.mouse.x)**2 + (this.previousMouse.y - this.mouse.y)**2)
        
        this.targetVelocity -= this.ease * (this.targetVelocity - this.velocity)
        this.followMouse.x -= this.ease * (this.followMouse.x - this.mouse.x)
        this.followMouse.y -= this.ease * (this.followMouse.y - this.mouse.y)

        this.previousMouse.x = this.mouse.x
        this.previousMouse.y = this.mouse.y
    }

    


}

export default Cursor