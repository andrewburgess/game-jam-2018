import * as debug from "debug"
import * as Phaser from "phaser"

export const BLOCK_SIZE = 32

const log = debug("game:entities:Block")

export class Block extends Phaser.GameObjects.Rectangle {
    public body: Phaser.Physics.Arcade.Body

    private color: Phaser.Display.Color

    constructor(scene: Phaser.Scene, x: number, y: number, color: string | Phaser.Display.Color = "#ffffff") {
        super(scene, x, y, BLOCK_SIZE, BLOCK_SIZE)

        this.color = typeof color === "string" ? Phaser.Display.Color.HexStringToColor(color) : color

        this.setFillStyle(this.color.color, 1)
        this.isFilled = true

        this.setStrokeStyle(1, this.color.clone().darken(50).color)
        this.isStroked = true

        this.type = "Block"

        this.scene.physics.add.existing(this)
        this.body.setCollideWorldBounds(true)

        log("constructed")
    }
}
