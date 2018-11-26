import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../Block"

import { Piece } from "./Piece"

const Vector2 = Phaser.Math.Vector2

export class TPiece extends Piece {
    public getBlockLocations(angle: number = this.actualAngle): Phaser.Math.Vector2[] {
        switch (angle) {
            case 0:
                return [new Vector2(0, 0), new Vector2(1, 0), new Vector2(-1, 0), new Vector2(0, -1)]
            case -180:
            case 180:
                return [new Vector2(0, 0), new Vector2(-1, 0), new Vector2(0, 1), new Vector2(1, 0)]
            case 90:
                return [new Vector2(0, 0), new Vector2(0, -1), new Vector2(0, 1), new Vector2(1, 0)]
            case -90:
                return [new Vector2(0, 0), new Vector2(0, -1), new Vector2(0, 1), new Vector2(-1, 0)]
            default:
                throw new Error(`invalid angle ${angle}`)
        }
    }

    public build() {
        this.color = Phaser.Display.Color.HexStringToColor("#FF00FF")
        this.add(new Block(this, 0, BLOCK_SIZE * -1, this.color))
        this.add(new Block(this, BLOCK_SIZE * -1, 0, this.color))
        this.add(new Block(this, 0, 0, this.color))
        this.add(new Block(this, BLOCK_SIZE, 0, this.color))

        this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        this.pivot = new Vector2(1, 1)
    }
}
