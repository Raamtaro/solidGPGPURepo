import * as THREE from 'three'
import Experience from './experience.js'


import VertexShader from '../../shaders/FinalOutput/vertex.glsl'
import FragmentShader from '../../shaders/FinalOutput/fragment.glsl'
import polarBearTexture from '../../../static/textures/PolarBear.jpg'

class PostScene { //Not going to bother creating a camera class for postScene. This one is going to be quite short and sweet.
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.cursor = this.experience.cursor

        this.instance = new THREE.Scene()
        this.camera = {} //Not going to bother creating a camera class for postScene. This one is going to be quite short and sweet.

        this.loader = new THREE.TextureLoader() //This is for testing that textures work


        this.cameraConfig()

        //Quad Material
        this.uniforms = {
            // uParticleSceneTexture: new THREE.Uniform(this.loader.load(polarBearTexture)), //Hello world
            uTime: new THREE.Uniform(0.0),
            uMouse: new THREE.Uniform(new THREE.Vector2(10, -10)),
            uTransitionProgress: new THREE.Uniform(0.0),
            uHoverProgress: new THREE.Uniform(0.0),
            uTexture1: new THREE.Uniform(null),
            uTexture2: new THREE.Uniform(null),
            uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
            uRadius: new THREE.Uniform(0.09),
        }

        this.material = new THREE.ShaderMaterial(
            {
                uniforms: this.uniforms,
                vertexShader: VertexShader,
                fragmentShader: FragmentShader,
                defines: {
                    PI: Math.PI,
                    PR: window.devicePixelRatio.toFixed(1),
                }
            }
        )

        this.setupQuad() //this.quad now accessible
        this.sizes.on('resize', this.resizeUpdate.bind(this))
        this.time.on('tick', this.updateUniforms.bind(this))
    }

    cameraConfig() {
        let frustumSize = 1
        let aspect = 1

        this.camera.instance = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        )
    }

    setupQuad() {
        this.quad = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            this.material
        )

        this.instance.add(this.quad)
    }

    resizeUpdate () {
        this.material.uniforms.uResolution.value.set(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)
    }

    updateUniforms () {
        this.material.uniforms.uMouse.value.x = this.cursor.followMouse.x
        this.material.uniforms.uMouse.value.y = this.cursor.followMouse.y

        this.material.uniforms.uTime.value = this.time.elapsed / 1000
        // console.log(this.material.uniforms.uMouse)
        
    }
}

export default PostScene