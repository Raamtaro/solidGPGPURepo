import EventEmitter from "./eventEmitter.js";
import Stats from "stats.js";

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        this.tick = this.tick.bind(this)

        requestAnimationFrame(this.tick)

    }

    tick() { 
        stats.begin()
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        // console.log(this.delta / 1000) //helps convert from ms to s

        this.trigger('tick')


        requestAnimationFrame(this.tick)
        stats.end()
    }
}

export default Time