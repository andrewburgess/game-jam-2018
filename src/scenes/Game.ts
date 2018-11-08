import * as debug from "debug"
import * as Phaser from "phaser"

import { BLOCK_SIZE } from "../entities/Block"
import { Piece, createPiece, Shape } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

export interface IGameInitialization {
    level: number
}

enum Direction {
    LEFT,
    RIGHT
}

export default class Game extends Phaser.Scene {
    /**
     * All individual blocks on the game board
     *
     * @private
     * @type {Phaser.Physics.Arcade.Group}
     * @memberof Game
     */
    private blocks: Phaser.Physics.Arcade.Group

    /**
     * The currently falling piece.
     *
     * @private
     * @type {Piece}
     * @memberof Game
     */
    private currentPiece: Piece

    /**
     * Current piece tween
     *
     * @private
     * @type {Phaser.Tweens.Tween}
     * @memberof Game
     */
    private currentTween: Phaser.Tweens.Tween

    /**
     * The level number (at least 1), which influences how fast pieces move
     *
     * @private
     * @type {number}
     * @memberof Game
     */
    private level: number

    /**
     * Direction the current piece is moving
     *
     * @private
     * @type {Direction.RIGHT}
     * @memberof Game
     */
    private pieceDirection: Direction

    constructor() {
        super({
            key: Scenes.Game,
            physics: {
                arcade: {
                    // debug: true,
                    gravity: { y: 300 }
                }
            }
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height, false, false, false, true)
        this.blocks = this.physics.add.group({
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true
        })
        this.physics.add.collider(this.blocks, this.blocks)

        this.level = config.level

        this.createNewFallingPiece()
    }

    private createNewFallingPiece() {
        log("createNewFallingPiece")

        const piece = createPiece(this, this.cameras.main.width / 2 - BLOCK_SIZE * 2, BLOCK_SIZE)
        this.add.existing(piece)
        this.blocks.addMultiple(piece.getBlocks())

        this.currentPiece = piece
        this.currentPiece.setGravity(false)

        this.currentTween = this.tweens.add({
            completeDelay: 100,
            delay: 1000,
            onComplete: () => this.createTween(),
            props: {
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Power1",
                    value: BLOCK_SIZE * 4
                }
            },
            targets: this.currentPiece
        })
    }

    private createTween() {
        if (this.currentTween) {
            this.currentTween.stop()
        }

        this.currentTween = this.tweens.add({
            completeDelay: 100,
            onComplete: () => this.onTweenComplete(),
            props: {
                x: {
                    duration: this.getMoveDuration(),
                    ease: "Power1",
                    value: this.pieceDirection === Direction.LEFT ? `-=${BLOCK_SIZE}` : `+=${BLOCK_SIZE}`
                }
            },
            targets: this.currentPiece
        })
    }

    private getMoveDuration() {
        return 1000 / (this.level / 1.5)
    }

    private onTweenComplete() {
        log(`currentPiece.x = ${this.currentPiece.x}`)
        const touchingLeft = this.currentPiece.x <= BLOCK_SIZE + BLOCK_SIZE / 2
        const touchingRight = this.currentPiece.x + this.currentPiece.width >= this.cameras.main.width - BLOCK_SIZE / 2
        if (touchingLeft || touchingRight) {
            this.pieceDirection = touchingLeft ? Direction.RIGHT : Direction.LEFT
            this.currentTween.stop()

            this.currentTween = this.tweens.add({
                completeDelay: 100,
                onComplete: () => this.createTween(),
                props: {
                    y: {
                        duration: this.getMoveDuration(),
                        ease: "Power1",
                        value: `+=${BLOCK_SIZE}`
                    }
                },
                targets: this.currentPiece
            })

            return
        }

        this.createTween()
    }
}
