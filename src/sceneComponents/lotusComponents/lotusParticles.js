import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'

//Shaders
import gpgpuParticlesShader from '../../shaders/pointCloud/gpgpu/particles.glsl'
import particlesVertexShader from '../../shaders/pointCloud/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/pointCloud/particles/fragment.glsl'
import Experience from '../experience/experience.js'

class LotusParticles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.scene.time
        // this.instance = null

        this.resources = this.experience.resources
        this.resource = this.resources.items.lotusModel
        this.setGeometry()

    }

    setGeometry() {
        this.resource.scene.traverse((child) => {
            if (child.isMesh) {
                this.geometry = child.geometry

                // this.scene.add(child)
                console.log(this.geometry)
                
            }
        })
    }
}

export default LotusParticles