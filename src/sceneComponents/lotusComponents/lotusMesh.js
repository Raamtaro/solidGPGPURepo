import * as THREE from 'three'
import Experience from '../experience/experience.js'
import halftoneVertex from '../../shaders/halftoneMesh/halftone/vertex.glsl'
import halftoneFragment from '../../shaders/halftoneMesh/halftone/fragment.glsl'

class LotusMesh {
    constructor() {
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.time = this.experience.time
        
        

        this.sizes = this.experience.sizes

        /**
         * Set up the material
         */
        this.materialParams = {
            color: '#ff4d67',
            shadowColor: '#e70896',
            lightColor: '#31bfb5'
        }


        this.uniforms = { 
            uColor: new THREE.Uniform(new THREE.Color(this.materialParams.color)),
            uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
            uShadowRepetitions: new THREE.Uniform(512),
            uShadowColor: new THREE.Uniform(new THREE.Color(this.materialParams.shadowColor)),
            uLightRepetitions: new THREE.Uniform(512),
            uLightColor: new THREE.Uniform(new THREE.Color(this.materialParams.lightColor))
        }

        this.shaderMaterial = new THREE.ShaderMaterial(
            {

                uniforms: this.uniforms,
                vertexShader: halftoneVertex,
                fragmentShader: halftoneFragment

            }
        )

        this.resources = this.experience.resources
        this.resource = this.resources.items.lotusModel
        this.setModel()
        this.sizes.on('resize', this.handleResize.bind(this))
        this.time.on('tick', this.update.bind(this))
    }

    setModel() {
        this.resource.scene.traverse((child) => {
            if (child.isMesh) {
                this.instance = child
                this.instance.material = this.shaderMaterial

                this.scene.add(this.instance)
                // console.log(this.instance)
                
            }
        })
    }

    handleResize() {
        this.instance.material.uniforms.uResolution.value.set(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)
    }

    update() {
        const elapsedTime = this.time.elapsed / 1000
        this.instance.rotation.x = elapsedTime * 0.2
        this.instance.rotation.y = elapsedTime * 0.12
        this.instance.rotation.z = - elapsedTime * 0.12
        
        
    }
}

export default LotusMesh