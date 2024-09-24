import * as THREE from 'three'
import Sizes from '../../utils/sizes.js'
import Cursor from '../../utils/cursor.js'
import Resources from '../../utils/Resources.js'


class Experience {

    constructor(sources, canvas) {

        window.experience = this
        this.canvas = canvas

        this.sizes = new Sizes()
        this.cursor = new Cursor(this)

        

        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)

        this.cameraGroup = new THREE.Group()
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width/this.sizes.height, 0.1, 100)
        this.cameraConfig()
        

        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true,
                alpha: true
            }
        )
        this.rendererConfig()
    }

    cameraConfig() {
        this.sizes.on('resize', this.cameraResizeUpdate.bind(this))
        this.scene.add(this.cameraGroup)
        this.camera.position.set(4.5, 14, 20)
        this.camera.lookAt(0, 0, 0)
        this.cameraGroup.add(this.camera)
    }

    cameraResizeUpdate() {
        // console.log('A resize be triggered')
        this.camera.aspect = this.sizes.width/ this.sizes.height
        this.camera.updateProjectionMatrix()
    }
    
    rendererConfig() {
        //set the pixel ratio
        this.sizes.on('resize', this.rendererResizeUpdate.bind(this))

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
        this.renderer.setClearColor('#7f7a7c')
    }

    rendererResizeUpdate() {
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
    }
}

export default Experience