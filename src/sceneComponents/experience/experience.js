import * as THREE from 'three'
import Stats from 'stats.js'
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
            /**
             * SCENE ONE PARTICLES
             */

            // this.lotusParticles = new LotusParticles()
            



            /**
             * SCENE TWO
             */
            this.LotusMesh = new LotusMesh()
        })



        this.time.on('tick', this.renderScene.bind(this))
    }

    renderScene () {
        this.renderer.instance.render(this.scene, this.camera.instance)
    }
}

export default Experience