import * as THREE from 'three'

//Shaders
import particlesVertexShader from '../../shaders/pointCloud/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/pointCloud/particles/fragment.glsl'
import Experience from '../experience/experience.js'
import GpgpuComputation from './gpgpu/gpgpu.js'

class LotusParticles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.scene.time

        this.resources = this.experience.resources
        this.resource = this.resources.items.lotusModel
        this.setGeometry()

        //Set up GPGPU
        this.gpgpu = new GpgpuComputation(this.geometry) //This should be doing all the heavy lifting on the GPGPU side of the sim, and so there shouldn't be much more to do aside from initiating it

        //Set up Particles
    }

    setGeometry() {
        this.resource.scene.traverse((child) => {
            if (child.isMesh) {
                this.geometry = child.geometry
                console.log(this.geometry)
                return
                
            }
        })
    }
}

export default LotusParticles