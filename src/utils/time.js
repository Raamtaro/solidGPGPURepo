import EventEmitter from "./eventEmitter.js";
import * as THREE from 'three'

class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        
        window.requestAnimationFrame(() =>
            {
                this.tick()
            }
        
        
        )
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        console.log('tick')

        window.requestAnimationFrame(() =>
            {
                this.tick()
            }
        )
    }
}

export default Time