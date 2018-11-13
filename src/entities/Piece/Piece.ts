import * as debug from "debug"
import { clamp, isUndefined } from "lodash"
import * as Phaser from "phaser"

import Game from "../../scenes/Game"

import { BLOCK_SIZE, Block } from "../Block"

import { Direction, IPieceConfiguration, RotateDirection, Shape } from "./"

const log = debug("game:entities:Piece")

export abstract class Piece extends Phaser.GameObjects.Container {
    /**
     * The actual angle of the Piece (use this instead of `angle` which might be in the process of
     * being tweened)
     *
     * @type {number}
     * @memberof Piece
     */
    public actualAngle: number
    public direction: Direction
    public location: Phaser.Math.Vector2
    public offset: Phaser.Math.Vector2
    public scene: Game

    protected color: Phaser.Display.Color
    protected level: number
    protected rotating: boolean
    protected shape: Shape
    protected tween: Phaser.Tweens.Tween

    constructor(scene: Game, x: number, y: number, config: IPieceConfiguration) {
        super(scene, x, y)
        this.actualAngle = 0
        this.rotating = false
        this.level = config.level || 1
        this.offset = Phaser.Math.Vector2.ZERO
        this.scene = scene
        this.shape = config.shape || Shape.I

        this.build()

        log("constructed")
    }

    public abstract getBlockLocations(angle?: number): Phaser.Math.Vector2[]

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
        this.scene.tweens.add({
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
        if (this.isRotating()) {
            return
        }

        const oldAngle = this.actualAngle
        const rawAngle = direction === RotateDirection.CLOCKWISE ? this.actualAngle + 90 : this.actualAngle - 90
        const newAngle = rawAngle < -180 || rawAngle > 180 ? Phaser.Math.Angle.WrapDegrees(rawAngle) : rawAngle

        if (!this.scene.board.canPieceMoveTo(this, this.location.x, this.location.y, newAngle)) {
            log("can't rotate")
            return
        }

        this.rotating = true
        this.actualAngle = newAngle

        this.scene.board.updateLocation(this, this.location, this.location, oldAngle, newAngle)

        this.tween = this.scene.tweens.add({
            onComplete: () => {
                this.rotating = false
            },
            props: {
                angle: {
                    duration: 150,
                    ease: "Quad.easeInOut",
                    value: newAngle
                }
            },
            targets: this
        })
    }

    protected abstract build(): void

    private getMoveDuration() {
        return clamp(1000 / (this.level / 1.5), 10, 600)
    }

    private movePiece(direction?: Direction): void {
        if (isUndefined(direction)) {
            direction = this.direction
        }

        const oldLocation = this.location.clone()
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

        this.location.x = newLocation.x
        this.location.y = newLocation.y
        this.scene.board.updateLocation(this, oldLocation, newLocation, this.actualAngle, this.actualAngle)

        this.tween = this.scene.tweens.add({
            onComplete: () => this.onMoveComplete(),
            props: {
                x: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: (this.offset.x + newLocation.x) * BLOCK_SIZE
                },
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: (this.offset.y + newLocation.y) * BLOCK_SIZE
                }
            },
            targets: this
        })
    }

    private onMoveComplete() {
        log("on move complete")

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
