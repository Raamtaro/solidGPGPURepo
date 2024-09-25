import * as THREE from 'three'
import Experience from './sceneComponents/experience/experience.js'
import sources from './sources.js'

/**
 * Driver Script
 * 
 * 1. Scene setup
 * 
 * 2. Set up any passes
 * 
 * Overlay in the html 
 * 
 * 3. tick() to sync up 
 */

/**
 * Stats fps meter
 */
// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

class Sketch {
    constructor() {

        this.experience = new Experience(sources, document.querySelector('canvas.webgl'))
        // this.clock = new THREE.Clock()
        // this.previousTime = 0
        // this.tick()

        console.log(this.experience)
    }



    // tick() {

    //     //Start Stats
    //     stats.begin()

    //     /**
    //      * Time mgmt
    //      */
    //     this.elapsedTime = this.clock.getElapsedTime()
    //     this.deltaTime = this.elapsedTime - this.previousTime
    //     this.previousTime = this.elapsedTime

    //     // console.log(this.deltaTime) //Values ~ 0.008

    //     /**
    //      * Cursor Stuff
    //      */

    //     //Parallax 

    //     //Velocity Calculation
    //     this.experience.cursor.calculateSpeed()

    //     const parallaxCoords = this.experience.cursor.parallaxCoords;
    //     const parallaxX = parallaxCoords.x * 0.3
    //     const parallaxY = - parallaxCoords.y * 0.3

    //     this.experience.cameraGroup.position.x += (parallaxX - this.experience.cameraGroup.position.x) * 5 * this.deltaTime
    //     this.experience.cameraGroup.position.y += (parallaxY - this.experience.cameraGroup.position.y) * 5 * this.deltaTime

    //     /**
    //      * Point Cloud Scene FX
    //      */

    //     //Model Rotation

    //     //GPGPU Update



    //     /**
    //      * Post Processing
    //      */





    //     //Render Normal Scene
    //     this.experience.renderer.render(this.experience.scene, this.experience.camera)

    //     //Call tick again on the next frame
    //     requestAnimationFrame(this.tick.bind(this))

    //     //Kill Stats
    //     stats.end()
    // }
}

export default Sketch