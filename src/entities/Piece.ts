import * as debug from "debug"
import { each, isUndefined, sample } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "./Block"

const log = debug("game:entities:Piece")

export enum Direction {
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

const ShapeValues = Object.keys(Shape)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))

export class Piece extends Phaser.GameObjects.Container {
    public blocks: Phaser.Physics.Arcade.Group
    public direction: Direction
    public scene: Phaser.Scene

    protected color: Phaser.Display.Color
    protected shape: Shape

    constructor(scene: Phaser.Scene, x: number, y: number, shape: Shape, direction: Direction) {
        super(scene, x, y)
        this.direction = direction
        this.scene = scene
        this.shape = shape

        this.build()
        this.setupPhysics()

        log("constructed")
    }

    public getBlocks(): Block[] {
        return this.getAll() as Block[]
    }

    public setGravity(enabled: boolean) {
        each(this.getBlocks(), (block) => block.body.setAllowGravity(enabled))
    }

    public update(time: number, delta: number) {
        const blocks = this.getBlocks()
        log("update")
        for (const block of blocks) {
            if (block.body.touching.none === false) {
                log("woah")
            }
        }
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

    private setupPhysics() {
        this.blocks = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)
        this.blocks.addMultiple(this.getBlocks())
    }
}

export function createPiece(scene: Phaser.Scene, x: number, y: number, shape?: Shape, direction?: Direction) {
    let index: number
    if (isUndefined(shape)) {
        index = sample(ShapeValues)!
    } else {
        index = shape
    }

    if (isUndefined(direction)) {
        direction = Direction.RIGHT
    }

    return new Piece(scene, x, y, index as Shape, direction)
}
