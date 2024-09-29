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

        this.instance = new THREE.Scene()
        this.camera = {} //Not going to bother creating a camera class for postScene. This one is going to be quite short and sweet.

        this.loader = new THREE.TextureLoader() //This is for testing that textures work


        this.cameraConfig()

        //Quad Material
        this.uniforms = {
            // uParticleSceneTexture: new THREE.Uniform(this.loader.load(polarBearTexture)), //Hello world
            uTexture1: new THREE.Uniform(null),
            uTexture2: new THREE.Uniform(null),
        }
        this.material = new THREE.ShaderMaterial(
            {
                uniforms: this.uniforms,
                vertexShader: VertexShader,
                fragmentShader: FragmentShader
            }
        )
        this.setupQuad() //this.quad now accessible

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
}

export default PostScene