import * as debug from "debug"
import * as Phaser from "phaser"

const log = debug("game:scenes:loading")

class Loading extends Phaser.Scene {
    constructor() {
        super({
            key: "loading"
        })

        log("constructed")
    }

    public preload() {
        log("preload")
    }

    public create() {
        log("create")
    }
}

export default Loading
