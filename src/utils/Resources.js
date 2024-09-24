import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'
import EventEmitter from './eventEmitter.js'

class Resources extends EventEmitter {
    constructor(sources) {
        super()
        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()

    }
    
    setLoaders () {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('/draco/')

        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
        
        // this.loaders.textureLoader = new THREE.TextureLoader()
    }

    async startLoading() {
        console.log('attempting to load glb...')
        try {
            const gltf = await this.loaders.gltfLoader.loadAsync(this.sources[0].path)
            this.loaded++
            console.log(gltf)
        } catch (error) {
            console.error(`Couldn't load ${this.sources[0].name}: ${error}`)
            console.log(this.sources)
        } finally {
            console.log('done')
        }
    } 
    
}

export default Resources