import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../Block"

import { Shape } from "./"
import { Piece } from "./Piece"

export class LPiece extends Piece {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.color = Phaser.Display.Color.HexStringToColor("#FF8800")
        this.shape = Shape.L
    }

    public build() {
        this.add(new Block(this.scene, BLOCK_SIZE * 2, 0, this.color))
        this.add(new Block(this.scene, 0, BLOCK_SIZE, this.color))
        this.add(new Block(this.scene, BLOCK_SIZE, BLOCK_SIZE, this.color))
        this.add(new Block(this.scene, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))
    }
}
