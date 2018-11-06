import * as debug from "debug"
import * as Phaser from "phaser"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Menu}`)

class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: Scenes.Menu
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
