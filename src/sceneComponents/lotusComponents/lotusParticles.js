import * as THREE from 'three'
// import { SubdivisionModifier } from 'three/examples/jsm/modifiers/SubdivisionModifier.js';

//Shaders
import particlesVertexShader from '../../shaders/pointCloud/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/pointCloud/particles/fragment.glsl'

import Experience from '../experience/experience.js'
import GpgpuComputation from './gpgpu/gpgpu.js'


class LotusParticles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.resources = this.experience.resources
        this.resource = this.resources.items.lotusModel
        this.setGeometry()
        // this.subdivideGeometry()

        this.count = this.geometry.attributes.position.count

        //Set up GPGPU
        this.gpgpu = new GpgpuComputation(this.geometry) //This should be doing all the heavy lifting on the GPGPU side of the sim, and so there shouldn't be much more to do aside from initiating it
        this.size = this.gpgpu.size
        //Set up Particles
        this.particlesUvArray = new Float32Array(this.count * 2)
        this.sizesArray = new Float32Array(this.count)
        this.populateArrays() 

        this.bufferGeometry = new THREE.BufferGeometry()

        /**
         * This is a sidequest, halftone params
         */
        this.materialParams = {
            color: '#ff4d67',
            shadowColor: '#e70896',
            lightColor: '#31bfb5'
        }

        this.uniforms = {
            uSize: new THREE.Uniform(0.004),
            uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
            uParticlesTexture: new THREE.Uniform(),
            uColor: new THREE.Uniform(new THREE.Color(this.materialParams.color)),
            uShadowRepetitions: new THREE.Uniform(512),
            uShadowColor: new THREE.Uniform(new THREE.Color(this.materialParams.shadowColor)),
            uLightRepetitions: new THREE.Uniform(512),
            uLightColor: new THREE.Uniform(new THREE.Color(this.materialParams.lightColor)),
            uMouse: new THREE.Uniform(new THREE.Vector2()),
            uAlpha: new THREE.Uniform(0.0)
        }
        this.shaderMaterial = new THREE.ShaderMaterial(
            {
                vertexShader: particlesVertexShader,
                fragmentShader: particlesFragmentShader,
                // transparent: true,
                // blending: THREE.AdditiveBlending,
                // depthTest: true,
                // depthWrite: false,
                uniforms: this.uniforms
            }
        )

        this.setupPoints()

        this.sizes.on('resize', this.handleResize.bind(this))
        this.time.on('tick', this.update.bind(this))
    }

    setGeometry() {
        this.resource.scene.traverse((child) => {
            if (child.isMesh) {
                this.geometry = child.geometry
                // console.log(this.geometry)
                return
                
            }
        })
    }

    // subdivideGeometry() {
    //     const geometry = this.geometry.clone();
    //     const modifier = new SubdivisionModifier(1);

    //     const smoothedGeometry = modifier.modify(geometry)
    // }

    populateArrays() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const i = (y * this.size + x)
                const i2 = i * 2

                //normalise 0 -> 1 
                const uvX = (x + 0.5) / this.size
                const uvY = (y + 0.5) / this.size

                this.particlesUvArray[i2 + 0] = uvX
                this.particlesUvArray[i2 + 1] = uvY

                //size
                this.sizesArray[i] = Math.random()
            }
        }
    }

    setupPoints() {
        this.bufferGeometry.setDrawRange(0, this.count)
        this.bufferGeometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(this.particlesUvArray, 2))
        this.bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizesArray, 1))

        this.points = new THREE.Points(this.bufferGeometry, this.shaderMaterial)
        this.points.frustumCulled = false

        this.points.renderOrder = 0
        // this.scene.add(this.points)

    }

    handleResize() {
        this.shaderMaterial.uniforms.uResolution.value.set(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)
    }

    update() {
        const deltaTime = this.time.delta / 1000
        
        this.shaderMaterial.uniforms.uParticlesTexture.value = this.gpgpu.instance.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture
        this.shaderMaterial.uniforms.uMouse.value.set(this.cursor.ndcFollowMouse) 
    }
}

export default LotusParticles