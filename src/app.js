import * as THREE from 'three'
import Experience from './sceneComponents/experience/experience.js'
import sources from './sources.js'


class Sketch {
    constructor() {

        this.experience = new Experience(sources, document.querySelector('canvas.webgl'))
        // console.log(this.experience)
    }
}

export default Sketch