import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../Block"

import { Shape } from "./"
import { Piece } from "./Piece"

export class ZPiece extends Piece {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.color = Phaser.Display.Color.HexStringToColor("#FF0000")
        this.shape = Shape.Z
    }

    public build() {
        this.add(new Block(this, 0, 0, this.color))
        this.add(new Block(this, BLOCK_SIZE, 0, this.color))
        this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
        this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))

        this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
    }
}
