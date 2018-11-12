import * as debug from "debug"
import * as Phaser from "phaser"

import { BLOCK_SIZE } from "../entities/Block"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.GameUI}`)

export default class GameUI extends Phaser.Scene {
    constructor() {
        super({
            key: Scenes.GameUI
        })

        log("constructed")
    }

    public create() {
        log("create")

        const pieceOutline = this.add.graphics()
        pieceOutline.lineStyle(2, 0xff0000, 1)
        pieceOutline.strokeRect(BLOCK_SIZE / 2, BLOCK_SIZE * 3, BLOCK_SIZE * 4, 2)
    }
}
