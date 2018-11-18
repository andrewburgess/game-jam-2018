import * as debug from "debug"
import * as Phaser from "phaser"

import { Piece } from "./Piece"

export const BLOCK_SIZE = 32

const log = debug("game:entities:Block")

export class Block extends Phaser.GameObjects.Rectangle {
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

        log("constructed")
    }
}

export class EmptyBlock extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, BLOCK_SIZE, BLOCK_SIZE)

        this.fillAlpha = 0.05
        this.fillColor = 0xffffff
        this.strokeAlpha = 0.7
        this.strokeColor = 0xffffff
        this.isStroked = true
        this.isFilled = true
        this.setOrigin(0, 0.5)

        this.type = "EmptyBlock"
    }
}
