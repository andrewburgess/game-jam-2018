import * as debug from "debug"
import * as Phaser from "phaser"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.BlocksTest}`)

export default class BlocksTest extends Phaser.Scene {
    constructor() {
        super({
            key: Scenes.BlocksTest
        })

        log("constructed")
    }
}
