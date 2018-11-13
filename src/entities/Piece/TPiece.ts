import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../Block"

import { Piece } from "./Piece"

export class TPiece extends Piece {
    public getBlockLocations(angle: number): Phaser.Math.Vector2[] {
        throw new Error("Method not implemented.")
    }

    public build() {
        this.color = Phaser.Display.Color.HexStringToColor("#FF00FF")
        this.add(new Block(this, 0, BLOCK_SIZE, this.color))
        this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
        this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))
        this.add(new Block(this, BLOCK_SIZE, 0, this.color))

        this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
    }
}
