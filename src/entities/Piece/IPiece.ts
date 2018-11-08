import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../Block"

import { Shape } from "./"
import { Piece } from "./Piece"

export class IPiece extends Piece {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.color = Phaser.Display.Color.HexStringToColor("#00FFFF")
        this.shape = Shape.I
    }

    public build() {
        this.add(new Block(this.scene, 0, 0, this.color))
        this.add(new Block(this.scene, BLOCK_SIZE, 0, this.color))
        this.add(new Block(this.scene, BLOCK_SIZE * 2, 0, this.color))
        this.add(new Block(this.scene, BLOCK_SIZE * 3, 0, this.color))
    }
}
