import * as debug from "debug"
import * as Phaser from "phaser"

const BLOCK_SIZE = 32

const log = debug("game:entities:Block")

class Block extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, BLOCK_SIZE, BLOCK_SIZE)

        this.setFillStyle(0xff0000, 1)
        this.isFilled = true

        this.setStrokeStyle(0x990000, 1)
        this.isStroked = true
        this.lineWidth = 2

        this.type = "Block"

        log("constructed")
    }
}

export default Block
