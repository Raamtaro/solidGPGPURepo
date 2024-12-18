import EventEmitter from "./eventEmitter.js"

class Sizes extends EventEmitter {
    constructor() {
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        window.addEventListener('resize', () =>
            {
                this.width = window.innerWidth
                this.height = window.innerHeight
                this.pixelRatio = Math.min(window.devicePixelRatio, 2)

                this.trigger('resize')
            }
        )
    }
    
}

export default Sizes