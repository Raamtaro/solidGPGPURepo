import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import Experience from '../../experience/experience.js'

import gpgpuShader from '../../../shaders/pointCloud/gpgpu/particles.glsl'

class GpgpuComputation {
    constructor(size) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.renderer = this.experience.renderer

        this.size = Math.ceil(Math.sqrt(size))
        this.instance = new GPUComputationRenderer(this.size, this.size, this.renderer)

    }
}

export default GpgpuComputation