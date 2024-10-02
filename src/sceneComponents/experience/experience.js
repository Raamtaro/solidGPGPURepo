import * as THREE from 'three'
import GUI from 'lil-gui'

import Sizes from '../../utils/sizes.js'
import Cursor from '../../utils/cursor.js'
import Resources from '../../utils/Resources.js'
import Time from '../../utils/time.js'
import Camera from './camera.js'
import Renderer from './renderer.js'
import LotusParticles from '../lotusComponents/lotusParticles.js'
import LotusMesh from '../lotusComponents/lotusMesh.js'
import { WebGLRenderTarget } from 'three'

//Final Composition
import LoadingScreen from './loading.js'
import PostScene from './postScene.js'


let instance = null

class Experience {

    constructor(sources, canvas) {

        if(instance)
            {
                return instance
            }
        instance = this

        window.experience = this
        this.canvas = canvas



        this.sizes = new Sizes()
        this.time = new Time()

        this.scenes = []
        this.renderables = []

        
          
        

        this.scene = new THREE.Scene() //Sample scene that I started out with. I need to go back and comment this out of everything it's included in, and then comment this out (and eventually delete after next commit)
        

        this.camera = new Camera()
        this.renderer = new Renderer()
        this.cursor = new Cursor()

        this.postScene = new PostScene()
        this.loadingScreen = new LoadingScreen()
        this.resources = new Resources(sources)
        this.currentScene = 0; //Tell us which scene to load... for now?

        this.resources.on('ready', this.startup.bind(this))
        this.sizes.on('resize', this.onResize.bind(this))

        // this.time.on('tick', this.renderScene.bind(this)) //Moved to the startup() function
    }

    startup() { //This method pretty much starts anything up which depends on the resources being defined.
        /**
         * On 'ready'
         * 
         * 1. Create Scenes
         * 2. Set up Gui
         * 3. Start the scene here so that the render doesn't try to access properties of each object before it's defined
         */
        
        
        this.createScenes()
        this.compileScenes()
        // this.combineScenes()
        this.setupGUI()

        // console.log(this.scenes[this.currentScene])
        /**
         * Finally, render
         */
        this.time.on('tick', this.renderScene.bind(this))


    }

    createScenes() {
        this.lotusParticles = new LotusParticles()
        this.lotusMesh = new LotusMesh()

        this.renderables.push(this.lotusParticles.points, this.lotusMesh.instance)
        // console.log(this.renderables)

        let i = 0
        this.renderables.forEach(
            (item) => {
                this.scenes.push({scene: new THREE.Scene()})
                this.scenes[i].scene.add(item)
                this.scenes[i].scene.add(this.camera.cameraGroup)
                i++
            }
        )

        // console.log(this.scenes)
    }

    compileScenes() {
        this.scenes.forEach(
            (obj, index) => {
                this.renderer.instance.compile(obj.scene, this.camera.instance)
                obj.target = new WebGLRenderTarget(this.sizes.width, this.sizes.height, {
                    format: THREE.RGBAFormat,
                    type: THREE.UnsignedByteType,
                    samples: 4
                })
                // obj.target.texture.minFilter = THREE.LinearFilter;
                // obj.target.texture.magFilter = THREE.LinearFilter;
                obj.target.texture.generateMipmaps = false
                
                // console.log(obj.target)
            }
        )
    }

    onResize() {
        //Need to resize the renderTargets as well
        this.scenes.forEach(
            (obj, index) => {
                obj.target.setSize(this.sizes.width, this.sizes.height)
            }
        )

    }

    // combineScenes () { //This function probably isn't necessary, I can just go ahead and define it... up top, honestly.
    //     this.postScene = new PostScene()
    // }

    setupGUI () {
        this.gui = new GUI({ width: 340 })
        
        this.gui.add(this.lotusParticles.shaderMaterial.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, 'value').min(0).max(1).step(0.001).name('uFlowfieldInfluence')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).step(0.001).name('uFlowfieldStrength')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, 'value').min(0).max(1).step(0.001).name('uFlowfieldFrequency')

        this.gui.destroy()
    }


    renderScene () {

        //Render Current
        this.renderer.instance.setRenderTarget(this.scenes[0].target)
        this.renderer.instance.render(this.scenes[0].scene, this.camera.instance)

        //Render Next
        this.renderer.instance.setRenderTarget(this.scenes[1].target)
        this.renderer.instance.render(this.scenes[1].scene, this.camera.instance)

        //CleanUp
        this.renderer.instance.setRenderTarget(null)

        //Set Post's uniforms
        this.postScene.material.uniforms.uTexture1.value = this.scenes[0].target.texture
        this.postScene.material.uniforms.uTexture2.value = this.scenes[1].target.texture





        // this.renderer.instance.render(this.scenes[0].scene, this.camera.instance) //Ground zero, this WILL render a scene barring any changes to the accessed objects
        this.renderer.instance.render(this.postScene.instance, this.postScene.camera.instance)
    }
}

export default Experience