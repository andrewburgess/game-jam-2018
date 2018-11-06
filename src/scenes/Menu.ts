import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

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

        const blocksTest = this.add.image(0, -100, Assets.BlocksTest).setInteractive()
        const movementTest = this.add.image(0, 100, Assets.MovementTest).setInteractive()

        this.add.container(this.centerX(), this.centerY(), [blocksTest, movementTest])

        blocksTest.once("pointerup", () => {
            this.scene.start(Scenes.BlocksTest)
        })

        movementTest.once("pointerup", () => {
            this.scene.start(Scenes.MovementTest)
        })
    }

    private centerX() {
        return this.cameras.main.width / 2
    }

    private centerY() {
        return this.cameras.main.height / 2
    }
}

export default Menu
