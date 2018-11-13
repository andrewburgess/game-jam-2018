import * as debug from "debug"
import { clamp, isUndefined, sample } from "lodash"
import * as Phaser from "phaser"

import Game from "../scenes/Game"

import { BLOCK_SIZE, Block } from "./Block"

const log = debug("game:entities:Piece")

export enum Direction {
    LEFT,
    DOWN,
    RIGHT
}

export enum RotateDirection {
    CLOCKWISE,
    COUNTER_CLOCKWISE
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
    public location: Phaser.Math.Vector2
    public offset: Phaser.Math.Vector2
    public scene: Game

    private color: Phaser.Display.Color
    private direction: Direction
    private level: number
    private rotating: boolean
    private shape: Shape
    private tween: Phaser.Tweens.Tween

    constructor(scene: Game, x: number, y: number, config: IPieceConfiguration) {
        super(scene, x, y)
        this.rotating = false
        this.level = config.level || 1
        this.offset = Phaser.Math.Vector2.ZERO
        this.scene = scene
        this.shape = config.shape || Shape.I

        this.build()

        log("constructed")
    }

    public getBlocks(): Block[] {
        return this.getAll() as Block[]
    }

    public isRotating() {
        return this.rotating
    }

    public onActivate() {
        log("onActivate")

        this.direction = Direction.RIGHT
        this.location = new Phaser.Math.Vector2(0, 0)

        // Tween to start position
        this.tween = this.scene.tweens.add({
            onComplete: () => {
                this.scene.onPieceActivated()
                this.movePiece()
            },
            props: {
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: this.y + BLOCK_SIZE * 3
                }
            },
            targets: this
        })
    }

    public rotate(direction: RotateDirection) {
        this.rotating = true

        const angle = (direction === RotateDirection.CLOCKWISE ? this.angle + 90 : this.angle - 90) % 360

        this.tween = this.scene.tweens.add({
            onComplete: () => {
                this.rotating = false
                this.movePiece()
            },
            props: {
                angle: {
                    duration: 250,
                    ease: "Quad.easeInOut",
                    value: angle
                }
            },
            targets: this
        })
    }

    private build() {
        switch (this.shape) {
            case Shape.I:
                this.color = Phaser.Display.Color.HexStringToColor("#00FFFF")
                this.add(new Block(this, BLOCK_SIZE * -1, 0, this.color))
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE * 2, 0, this.color))

                this.setSize(BLOCK_SIZE * 4, BLOCK_SIZE)
                this.offset = new Phaser.Math.Vector2(1, 0)
                break
            case Shape.J:
                this.color = Phaser.Display.Color.HexStringToColor("#0000FF")
                this.add(new Block(this, BLOCK_SIZE * -1, BLOCK_SIZE * -1, this.color))
                this.add(new Block(this, BLOCK_SIZE * -1, 0, this.color))
                this.add(new Block(this, 0, 0, this.color))
                this.add(new Block(this, BLOCK_SIZE, 0, this.color))

                this.setSize(BLOCK_SIZE * 3, BLOCK_SIZE * 2)
                this.offset = new Phaser.Math.Vector2(1, 1)
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

    private getMoveDuration() {
        return clamp(1000 / (this.level / 1.5), 10, 600)
    }

    private movePiece(direction?: Direction): void {
        if (this.isRotating()) {
            return
        }

        if (isUndefined(direction)) {
            direction = this.direction
        }

        const newLocation = new Phaser.Math.Vector2(this.location.x, this.location.y)
        switch (direction) {
            case Direction.DOWN:
                newLocation.y++
                break
            case Direction.LEFT:
                newLocation.x--
                break
            case Direction.RIGHT:
                newLocation.x++
                break
        }

        const canMoveToNewLocation = this.scene.board.canPieceMoveTo(this, newLocation.x, newLocation.y)

        if (!canMoveToNewLocation && direction === Direction.DOWN) {
            // If we can't move and we also can't move down anymore, then it is considered "settled", and we can
            // activate the next piece on the board
            this.tween.stop()
            this.scene.onPieceSettled()
            return
        }

        if (!canMoveToNewLocation) {
            // We can't move our piece left or right anymore, so let's switch the direction, but force the piece to
            // move down one block
            this.direction = direction === Direction.LEFT ? Direction.RIGHT : Direction.LEFT
            return this.movePiece(Direction.DOWN)
        }

        log(`move piece ${this.shape} ${newLocation.x},${newLocation.y}`)

        this.tween = this.scene.tweens.add({
            onComplete: () => this.onMoveComplete(newLocation),
            props: {
                x: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: `+=${(newLocation.x - this.location.x) * BLOCK_SIZE}`
                },
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: `+=${(newLocation.y - this.location.y) * BLOCK_SIZE}`
                }
            },
            targets: this
        })
    }

    private onMoveComplete(newLocation: Phaser.Math.Vector2) {
        log("on move complete")

        this.scene.board.updateLocation(this, this.location, newLocation)
        this.location.x = newLocation.x
        this.location.y = newLocation.y

        if (this.direction === Direction.LEFT && this.scene.board.touchingLeft(this)) {
            this.direction = Direction.RIGHT
            this.movePiece(Direction.DOWN)
        } else if (this.direction === Direction.RIGHT && this.scene.board.touchingRight(this)) {
            this.direction = Direction.LEFT
            this.movePiece(Direction.DOWN)
        } else {
            this.movePiece()
        }
    }
}

export function createPiece(scene: Game, x: number, y: number, config: IPieceConfiguration = {}) {
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
