import * as THREE from 'three'
import Experience from './experience.js'    

class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene

        
        this.cameraGroup = new THREE.Group()
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width/this.sizes.height, 0.1, 100)
        this.config()
    }

    config () {
        this.sizes.on('resize', this.cameraResizeUpdate.bind(this))
        this.scene.add(this.cameraGroup)
        this.instance.position.set(4.5, 14, 20)
        this.instance.lookAt(0, 0, 0)
        this.cameraGroup.add(this.instance)
    }

    cameraResizeUpdate () {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}

export default Camera