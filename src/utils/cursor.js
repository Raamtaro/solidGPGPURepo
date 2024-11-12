import * as THREE from 'three'
import EventEmitter from './eventEmitter.js'
import Experience from '../sceneComponents/experience/experience.js'

class Cursor extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.sizes = this.experience.sizes

        // console.log(this.experience)
        this.cameraGroup = this.experience.camera.cameraGroup
        this.deltaTime = this.experience.time.delta / 1000


        //Coordinates for Parallax effect -> -.5 to .5
        this.parallaxCoords = {x: 0, y: 0}

        //Coordinates for general Shader Stuff 0 to 1
        this.mouse = new THREE.Vector2()
        this.followMouse = new THREE.Vector2()
        this.previousMouse = new THREE.Vector2()

        //Normalized device coordinates for Raycaster stuff -1 to 1
        this.ndcMouse = new THREE.Vector2()
        this.ndcFollowMouse = new THREE.Vector2()
        this.ndcPreviousMouse = new THREE.Vector2()

        //Ease Factor for things like trailing 
        this.ease = 0.06

        //Velocity of the mouse for shader effects and the like.
        this.velocity = 0
        this.targetVelocity = 0

        window.addEventListener('mousemove', this.handleMouse.bind(this))
        this.experience.time.on('tick', this.handleTick.bind(this)) 
    }

    handleMouse(event) {
        this.parallaxCoords.x = event.clientX / this.sizes.width - 0.5
        this.parallaxCoords.y = event.clientY / this.sizes.height - 0.5

        this.mouse.x = event.clientX / this.sizes.width
        this.mouse.y = 1.0 - (event.clientY / this.sizes.height)

        this.ndcMouse.x = (event.clientX / this.sizes.width) * 2 - 1;
        this.ndcMouse.y = -(event.clientY / this.sizes.height) * 2 + 1;


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

        this.previousMouse.x = this.mouse.x
        this.previousMouse.y = this.mouse.y

        //Normalised
        this.ndcFollowMouse.x -= this.ease * (this.ndcFollowMouse.x - this.ndcMouse.x)
        this.ndcFollowMouse.y -= this.ease * (this.ndcFollowMouse.y - this.ndcMouse.y)

        this.ndcPreviousMouse.x = this.ndcMouse.x
        this.ndcPreviousMouse.y = this.ndcMouse.y

        // console.log(this.ndcFollowMouse)
        // console.log(this.followMouse)
    }


    determineParallax() {
        const parallaxCoords = this.parallaxCoords
        const parallaxX = parallaxCoords.x * 0.9
        const parallaxY = - parallaxCoords.y * 0.9

        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * this.deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * this.deltaTime

    }

    


}

export default Cursor