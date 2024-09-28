import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import Experience from '../../experience/experience.js'

import gpgpuShader from '../../../shaders/pointCloud/gpgpu/particles.glsl'

const clamp = (number, min, max) => {
    return Math.max(min, Math.min(number, max))
}

class GpgpuComputation {
    constructor(baseGeometry) { // Need to access the positions
        this.experience = new Experience()
        
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.renderer = this.experience.renderer
        this.resources = this.experience.resources
        this.cursor = this.experience.cursor
        this.sizes = this.experience.sizes

        this.baseGeometry = baseGeometry
        this.count = this.baseGeometry.attributes.position.count

        console.log(this.count)
        this.positionArray = this.baseGeometry.attributes.position.array
        this.size = Math.ceil(Math.sqrt(this.count))
        this.instance = new GPUComputationRenderer(this.size, this.size, this.renderer.instance)



        this.baseParticlesTexture = this.instance.createTexture()
        this.populateBaseTexture() 

        this.particlesVariable = this.instance.addVariable('uParticles', gpgpuShader, this.baseParticlesTexture)
        this.configParticlesVariable()
        
        // console.log(this.renderer)
        console.log('GPGPU attempting init')
        

        this.instance.init()

        

        this.debug = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 3),
            new THREE.MeshBasicMaterial(
                {
                    map: this.instance.getCurrentRenderTarget(this.particlesVariable).texture
                }
            )
        )

        this.scene.add(this.debug)
        this.debug.visible = false
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

        // console.log(this.baseParticlesTexture.image.data) //Debug log statement
    }

    configParticlesVariable() {
        this.instance.setVariableDependencies(this.particlesVariable, [this.particlesVariable])

        this.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
        this.particlesVariable.material.uniforms.uBase = new THREE.Uniform(this.baseParticlesTexture)
        this.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.974)
        this.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(1.23)
        this.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.88)
        this.particlesVariable.material.uniforms.uVelocity = new THREE.Uniform(0.0)
        this.particlesVariable.material.uniforms.uMouse = new THREE.Uniform(new THREE.Vector2(-10.0, 10.0))
        // this.particlesVariable.material.uniforms.uRepulsion = new THREE.Uniform(new THREE.Vector3())
        // this.particlesVariable.material.uniforms.uBounds = new THREE.Uniform(this.instance.size)
    }

    update() {
        const elapsedTime = this.time.elapsed / 1000
        const deltaTime = this.time.delta / 1000

        const targetVelocity = this.cursor.targetVelocity
        const mouse = this.cursor.followMouse
        

        this.particlesVariable.material.uniforms.uTime.value = elapsedTime
        this.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime

        this.particlesVariable.material.uniforms.uMouse.value.x = mouse.x
        this.particlesVariable.material.uniforms.uMouse.value.y = mouse.y
        this.particlesVariable.material.uniforms.uVelocity.value = Math.min(this.cursor.targetVelocity, 0.075)
        this.cursor.targetVelocity *= .9999999999
        // console.log(this.particlesVariable.material.uniforms.uMouse.value)
        
        // this.updateTexture()
        this.instance.compute()

    }

    // updateTexture () {
    //     const data = this.baseParticlesTexture
    //     const size = this.size

    //     for (let i = 0; i < data.length; i+= 4) {
    //         data[i] *= .97
    //         data[i + 1] *= .97
    //     }

    //     const gridMouseX = size * this.cursor.followMouse.x
    //     const gridMouseY = size * (1.0 - this.cursor.followMouse.y)

    //     const maxDist = size * .41 //mouse radius
    //     const aspect = this.sizes.height/this.sizes.width

    //     for (let i = 0; i < size; i++) {
    //         for (let j = 0; j < size; j++) {
    //             const distance = ((gridMouseX - i)**2) / aspect + (gridMouseY - j) ** 2;
    //             const maxDistSq = maxDist**2;

    //             if (distance < maxDistSq) {
    //                 let index = 4 * (i + size*j)
    //                 let power = maxDist / Math.sqrt(distance)
    //                 power = clamp(power, 0, 10)
    //                 data[index] += .01 * 100 * this.cursor.targetVelocity * power;
    //                 data[index+1] -= .01 * 100 * this.cursor.targetVelocity * power;
    //             }
    //         }
    //     }

    //     data.needsUpdate = true


    // }
}

export default GpgpuComputation