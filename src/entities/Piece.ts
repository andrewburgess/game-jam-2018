import * as debug from "debug"
import { isUndefined, sample } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "./Block"

const log = debug("game:entities:Piece")

export enum MoveState {
    DOWN,
    LEFT,
    RIGHT,
    UP
}

export enum Shape {
    I,
    J,
    L,
    O,
    S,
    T,
    Z
}

export interface IPieceConfiguration {
    level?: number
    shape?: Shape
}

const ShapeValues = Object.keys(Shape)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))

export class Piece extends Phaser.GameObjects.Container {
    public scene: Phaser.Scene

    private color: Phaser.Display.Color
    private level: number
    private moveState: MoveState
    private shape: Shape

    constructor(scene: Phaser.Scene, x: number, y: number, config: IPieceConfiguration) {
        super(scene, x, y)
        this.moveState = MoveState.DOWN
        this.level = config.level || 1
        this.scene = scene
        this.shape = config.shape || Shape.I

        this.build()

        log("constructed")
    }

    public getBlocks(): Block[] {
        return this.getAll() as Block[]
    }

    public onActivate() {
        log("onActivate")
    }

    private build() {
        switch (this.shape) {
            case Shape.I:
                this.color = Phaser.Display.Color.HexStringToColor("#00FFFF")
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE * 3, 0, this.color))

                this.setSize(BLOCK_SIZE * 4, BLOCK_SIZE)
                break
            case Shape.J:
                this.color = Phaser.Display.Color.HexStringToColor("#0000FF")
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, 0, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                break
            case Shape.L:
                this.color = Phaser.Display.Color.HexStringToColor("#FF8800")
                this.add(new Block(this, BLOCK_SIZE * 2, 0, this.color))
                this.add(new Block(this, 0, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                break
            case Shape.O:
                this.color = Phaser.Display.Color.HexStringToColor("#FFFF00")
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, 0, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))

                this.setSize(BLOCK_SIZE * 2, BLOCK_SIZE * 2)
                break
            case Shape.S:
                this.color = Phaser.Display.Color.HexStringToColor("#00FF00")
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, 0, this.color))
                this.add(new Block(this, 0, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                break
            case Shape.T:
                this.color = Phaser.Display.Color.HexStringToColor("#FF00FF")
                this.add(new Block(this, 0, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                break
            case Shape.Z:
                this.color = Phaser.Display.Color.HexStringToColor("#FF0000")
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, BLOCK_SIZE, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, BLOCK_SIZE, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                break
            default:
                throw new TypeError(`unknown piece shape ${this.shape}`)
        }
    }
}

export function createPiece(scene: Phaser.Scene, x: number, y: number, config: IPieceConfiguration = {}) {
    let index: number
    if (isUndefined(config.shape)) {
        index = sample(ShapeValues)!
    } else {
        index = config.shape
    }

    return new Piece(scene, x, y, {
        level: config.level,
        shape: index as Shape
    })
}
