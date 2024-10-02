import * as THREE from 'three'
import Experience from './experience'

import {gsap} from 'gsap'

/**
 * I am going to call this in the 
 */

class LoadingScreen {

    constructor() {
        this.experience = new Experience()


        this.postScene = this.experience.postScene
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.cursor = this.experience.cursor
        this.loadingBarElement = document.querySelector('.loading-bar')


        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        
        this.material = new THREE.ShaderMaterial(
            {
                uniforms: {
                    uAlpha: {value: 1.0}
                },
                vertexShader:`
                varying vec2 vUv;

                void main() {
                    gl_Position = vec4(position, 1.0);

                    vUv = uv;
                }`,
                fragmentShader:`
                varying vec2 vUv;
                uniform float uAlpha;

                void main() {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);

                }`,
                transparent: true
            }
        )

        this.instance = new THREE.Mesh(this.geometry, this.material)
        this.postScene.instance.add(this.instance)

        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () =>
                {
                    // console.log('loaded')
                    // gsap.to(this.instance.material.uniforms.uAlpha, { duration: 3, value: 0 })

                    window.setTimeout(() => {   
                        gsap.to(this.instance.material.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

                        this.loadingBarElement.classList.add('ended')
                        this.loadingBarElement.style.transform = ''
                    })
                },
        
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) =>
                {
                    // console.log(itemUrl, itemsLoaded, itemsTotal) //Hello Args

                    
                    this.progressRatio = itemsLoaded/itemsTotal
                    console.log(this.progressRatio)

                    this.loadingBarElement.style.transform = `scaleX(${this.progressRatio})`
                }
        )

        

    }


}


export default LoadingScreen