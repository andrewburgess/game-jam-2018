import * as debug from "debug"
import * as Phaser from "phaser"

import { Piece } from "./Piece"

export const BLOCK_SIZE = 32

const log = debug("game:entities:Block")

export class Block extends Phaser.GameObjects.Rectangle {
    public body: Phaser.Physics.Arcade.Body
    public piece: Piece

    private color: Phaser.Display.Color

    constructor(piece: Piece, x: number, y: number, color: string | Phaser.Display.Color = "#ffffff") {
        super(piece.scene, x, y, BLOCK_SIZE, BLOCK_SIZE)

        this.piece = piece

        this.color = typeof color === "string" ? Phaser.Display.Color.HexStringToColor(color) : color

        this.setFillStyle(this.color.color, 1)
        this.isFilled = true

        this.setStrokeStyle(1, this.color.clone().darken(50).color)
        this.isStroked = true

        this.type = "Block"

        this.scene.physics.add.existing(this)
        this.body.setCollideWorldBounds(true)
        this.body.onCollide = true

        log("constructed")
    }

    public update() {
        if (this.body.touching) {
            log(`touching: ${this.body.touching}`)
        }
    }
}
