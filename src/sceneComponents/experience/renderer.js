import * as THREE from 'three'
import Experience from './experience.js'   

class Renderer {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.canvas = this.experience.canvas
        this.instance = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true,
                alpha: true
            }
        )
        this.rendererConfig()
    }

    rendererConfig() {
        this.sizes.on('resize', this.rendererResizeUpdate.bind(this))

        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.outputColorSpace = THREE.SRGBColorSpace

        this.instance.setClearColor('#003333')
        // this.instance.setClearAlpha(0)
        
    }

    rendererResizeUpdate() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }
    
}

export default Renderer