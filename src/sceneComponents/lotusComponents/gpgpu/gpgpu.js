import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import Experience from '../../experience/experience.js'

import gpgpuShader from '../../../shaders/pointCloud/gpgpu/particles.glsl'

class GpgpuComputation {
    constructor(baseGeometry) { // Need to access the positions
        this.experience = new Experience()
        
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.renderer = this.experience.renderer
        this.resources = this.experience.resources

        this.baseGeometry = baseGeometry
        this.count = this.baseGeometry.attributes.position.count
        this.positionArray = this.baseGeometry.attributes.position.array
        this.size = Math.ceil(Math.sqrt(this.count))
        this.instance = new GPUComputationRenderer(this.size, this.size, this.renderer)

        this.baseParticlesTexture = this.instance.createTexture()
        this.populateBaseTexture() 

        this.particlesVariable = this.instance.addVariable('uParticles', gpgpuShader, this.baseParticlesTexture)
        this.configParticlesVariable()

        console.log('GPGPU attempting init')

        this.instance.init()

        

        // this.debug = new THREE.Mesh(
        //     new THREE.PlaneGeometry(3, 3),
        //     new THREE.MeshBasicMaterial(
        //         {
        //             map: this.instance.getCurrentRenderTarget(this.particlesVariable).texture
        //         }
        //     )
        // )
        this.time.on('tick', this.update.bind(this))

    }

    populateBaseTexture() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3 
            const i4 = i * 4

            //Set Positions
            this.baseParticlesTexture.image.data[i4 + 0] = this.positionArray[i3 + 0]
            this.baseParticlesTexture.image.data[i4 + 1] = this.positionArray[i3 + 1]
            this.baseParticlesTexture.image.data[i4 + 2] = this.positionArray[i3 + 2]
            this.baseParticlesTexture.image.data[i4 + 3] = Math.random()
        }

        console.log(this.baseParticlesTexture.image.data) //Debug log statement
    }

    configParticlesVariable() {
        this.instance.setVariableDependencies(this.particlesVariable, [this.particlesVariable])

        this.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uBase = new THREE.Uniform(this.baseParticlesTexture)
        this.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.974)
        this.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(1.129)
        this.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.708)
        this.particlesVariable.material.uniforms.uRepulsion = new THREE.Uniform(new THREE.Vector3())
        this.particlesVariable.material.uniforms.uBounds = new THREE.Uniform(this.instance.size)
    }

    update() {
        const elapsedTime = this.time.elapsed / 1000
        const deltaTime = this.time.delta / 1000
        this.particlesVariable.material.uniforms.uTime.value = elapsedTime
        this.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime
        this.instance.compute()

    }
}

export default GpgpuComputation