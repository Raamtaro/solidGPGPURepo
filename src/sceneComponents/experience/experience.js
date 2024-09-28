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

        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)

        this.camera = new Camera()
        this.renderer = new Renderer()
        this.cursor = new Cursor()

        this.resources.on('ready', () => {
            // /**
            //  * SCENE ONE PARTICLES
            //  */

            this.lotusParticles = new LotusParticles()

            // /**
            //  * SCENE TWO --- Kind of works as a Hello World 
            //  */
            // this.LotusMesh = new LotusMesh()
            this.setupGUI() 
        })

        

        this.time.on('tick', this.renderScene.bind(this))
    }



    setupGUI () {
        this.gui = new GUI({ width: 340 })
        
        this.gui.add(this.lotusParticles.shaderMaterial.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, 'value').min(0).max(1).step(0.001).name('uFlowfieldInfluence')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).step(0.001).name('uFlowfieldStrength')
        // gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).step(0.001).name('uFlowfieldStrength')
        this.gui.add(this.lotusParticles.gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, 'value').min(0).max(1).step(0.001).name('uFlowfieldFrequency')
    }

    renderScene () {
        this.renderer.instance.render(this.scene, this.camera.instance)
    }
}

export default Experience