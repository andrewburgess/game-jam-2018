import * as debug from "debug"
import { map, range } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "./Block"

const log = debug("game:entities:Piece")

export enum PieceShape {
    I,
    J,
    L,
    O,
    S,
    T,
    Z
}

const I_COLOR = Phaser.Display.Color.HexStringToColor("#00FFFF")
const J_COLOR = Phaser.Display.Color.HexStringToColor("#0000FF")
const L_COLOR = Phaser.Display.Color.HexStringToColor("#FF8800")
const O_COLOR = Phaser.Display.Color.HexStringToColor("#FFFF00")
const S_COLOR = Phaser.Display.Color.HexStringToColor("#00FF00")
const T_COLOR = Phaser.Display.Color.HexStringToColor("#FF00FF")
const Z_COLOR = Phaser.Display.Color.HexStringToColor("#FF0000")

export class Piece extends Phaser.GameObjects.Container {
    private shape: PieceShape

    constructor(scene: Phaser.Scene, shape: PieceShape, x: number, y: number) {
        super(scene, x, y)

        this.shape = shape
        this.type = "Piece"

        this.buildShape()

        log("constructed")
    }

    private buildShape() {
        switch (this.shape) {
            case PieceShape.I:
                map(range(4), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, 0, I_COLOR)))
                break
            case PieceShape.J:
                map(range(3), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, BLOCK_SIZE, J_COLOR)))
                this.add(new Block(this.scene, 0, 0, J_COLOR))
                break
            case PieceShape.L:
                map(range(3), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, BLOCK_SIZE, L_COLOR)))
                this.add(new Block(this.scene, BLOCK_SIZE * 2, 0, L_COLOR))
                break
            case PieceShape.O:
                map(range(2), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, 0, O_COLOR)))
                map(range(2), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, BLOCK_SIZE, O_COLOR)))
                break
            case PieceShape.S:
                map(range(2), (i) => this.add(new Block(this.scene, (i + 1) * BLOCK_SIZE, 0, S_COLOR)))
                map(range(2), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, BLOCK_SIZE, S_COLOR)))
                break
            case PieceShape.T:
                map(range(3), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, BLOCK_SIZE, T_COLOR)))
                this.add(new Block(this.scene, BLOCK_SIZE, 0, T_COLOR))
                break
            case PieceShape.Z:
                map(range(2), (i) => this.add(new Block(this.scene, (i + 1) * BLOCK_SIZE, BLOCK_SIZE, Z_COLOR)))
                map(range(2), (i) => this.add(new Block(this.scene, i * BLOCK_SIZE, 0, Z_COLOR)))
                break
        }
    }
}
