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
    public location: Phaser.Math.Vector2
    public pivot: Phaser.Math.Vector2
    public scene: Game

    protected beingBeamed: boolean
    protected color: Phaser.Display.Color
    protected direction: Direction
    protected level: number
    protected rotating: boolean
    protected shape: Shape
    protected tween?: Phaser.Tweens.Tween

    constructor(scene: Game, x: number, y: number, config: IPieceConfiguration) {
        super(scene, x, y)
        this.actualAngle = 0
        this.beingBeamed = false
        this.rotating = false
        this.level = config.level || 1
        this.scene = scene
        this.shape = config.shape || Shape.I

        this.build()
        this.location = this.pivot.clone()

        log("constructed")
    }

    public abstract getBlockLocations(angle?: number): Phaser.Math.Vector2[]

    public getBlocks(): Block[] {
        return this.getAll() as Block[]
    }

    public isBeingBeamed() {
        return this.beingBeamed
    }

    public isRotating() {
        return this.rotating
    }

    public onActivate() {
        log("onActivate")

        this.direction = Direction.RIGHT

        // Tween to start position
        this.scene.tweens.add({
            onComplete: () => {
                this.scene.onPieceActivated()
                this.move()
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

    public resumeMove() {
        log("resumeMove")
        this.move()
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

    public setBeingBeamed(isBeingBeamed: boolean) {
        this.beingBeamed = isBeingBeamed
    }

    protected abstract build(): void

    private getMoveDuration() {
        return clamp(1000 / (this.level / 1.5), 10, 600)
    }

    private move(direction?: Direction): void {
        if (this.isBeingBeamed()) {
            direction = Direction.DOWN
        }

        if (isUndefined(direction)) {
            direction = this.direction
        }

        const oldLocation = this.location.clone()
        const newLocation = new Phaser.Math.Vector2(Math.floor(this.location.x), Math.floor(this.location.y))
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
            this.tween!.stop()
            this.scene.onPieceSettled()
            return
        }

        if (!canMoveToNewLocation) {
            // We can't move our piece left or right anymore, so let's switch the direction, but force the piece to
            // move down one block
            this.direction = direction === Direction.LEFT ? Direction.RIGHT : Direction.LEFT
            return this.move(Direction.DOWN)
        }

        log(`move piece ${this.shape} ${newLocation.x},${newLocation.y}`)

        this.location = newLocation
        this.scene.board.updateLocation(this, oldLocation, newLocation, this.actualAngle, this.actualAngle)

        this.tween = this.scene.tweens.add({
            onComplete: () => this.onMoveComplete(),
            props: {
                x: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: newLocation.x * BLOCK_SIZE
                },
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Quad.easeInOut",
                    value: newLocation.y * BLOCK_SIZE
                }
            },
            targets: this
        })
    }

    private onMoveComplete() {
        log("on move complete")

        if (this.direction === Direction.LEFT && this.scene.board.touchingLeft(this)) {
            this.direction = Direction.RIGHT
            this.move(Direction.DOWN)
        } else if (this.direction === Direction.RIGHT && this.scene.board.touchingRight(this)) {
            this.direction = Direction.LEFT
            this.move(Direction.DOWN)
        } else {
            this.move()
        }
    }
}
