import * as debug from "debug"
import * as Phaser from "phaser"

const log = debug("game:scenes:menu")

class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: "menu"
        })

        log("constructed")
    }

    public preload() {
        log("preload")
    }

    public create(data: any) {
        log("create", data)
    }

    public update() {}
}

export default Menu
