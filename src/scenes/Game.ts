import * as debug from "debug"
import { clamp } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "../entities/Block"
import { Direction, Piece, createPiece } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

export interface IGameInitialization {
    level: number
}

export default class Game extends Phaser.Scene {
    /**
     * The currently falling piece.
     *
     * @protected
     * @type {Piece}
     * @memberof Game
     */
    protected currentPiece: Piece

    /**
     * All individual blocks on the game board
     *
     * @private
     * @type {Phaser.Physics.Arcade.Group}
     * @memberof Game
     */
    private blocks: Phaser.Physics.Arcade.Group

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

    constructor(inKey: string = Scenes.Game) {
        super({
            key: inKey,
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

        // this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height, false, false, false, true)
        this.blocks = this.physics.add.group({
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true
        })
        this.physics.add.collider(this.blocks, this.blocks)

        this.level = config.level

        const test = createPiece(this, BLOCK_SIZE * 4, BLOCK_SIZE * 6)
        this.add.existing(test)
        this.blocks.addMultiple(test.getBlocks())
        test.setGravity(false)

        this.physics.world.on(
            "collide",
            (main: Phaser.GameObjects.GameObject, other: Phaser.GameObjects.GameObject) => {
                if (main.type === "Block" && other.type === "Block") {
                    const block = main as Block
                    const otherBlock = other as Block

                    if (block.piece !== otherBlock.piece) {
                        let firstX = block.piece.x / BLOCK_SIZE
                        if (Math.round(firstX) > firstX) {
                            firstX = firstX + 1
                        }

                        let secondX = otherBlock.piece.x / BLOCK_SIZE
                        if (Math.round(secondX) > secondX) {
                            secondX = secondX + 1
                        }

                        block.piece.setPosition(Math.floor(firstX) * BLOCK_SIZE, block.piece.y)
                        otherBlock.piece.setPosition(Math.floor(secondX) * BLOCK_SIZE, otherBlock.piece.y)
                        this.currentTween.pause()
                    }
                }
            }
        )

        this.createNewFallingPiece()
    }

    public update(time: number, delta: number) {
        log(`time: ${time}, delta: ${delta}`)
    }

    private createNewFallingPiece() {
        log("createNewFallingPiece")

        const piece = createPiece(this, BLOCK_SIZE * 4, BLOCK_SIZE)
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
            props: {
                x: {
                    duration: this.getMoveDuration(),
                    ease: "Power1",
                    value: {
                        getEnd: (target: Piece, key: string, value: number) => {
                            const touchingLeft = this.currentPiece.x <= BLOCK_SIZE + BLOCK_SIZE / 2
                            const touchingRight =
                                this.currentPiece.x + this.currentPiece.width >=
                                this.cameras.main.width - BLOCK_SIZE / 2

                            if (
                                (touchingLeft && this.currentPiece.direction === Direction.LEFT) ||
                                (touchingRight && this.currentPiece.direction === Direction.RIGHT)
                            ) {
                                this.currentPiece.direction = Direction.DOWN
                            }

                            if (this.currentPiece.direction === Direction.DOWN) {
                                return value
                            }

                            return this.currentPiece.direction === Direction.LEFT
                                ? value - BLOCK_SIZE
                                : value + BLOCK_SIZE
                        },
                        getStart: (target: Piece, key: string) => {
                            return target[key]
                        }
                    }
                },
                y: {
                    duration: this.getMoveDuration(),
                    ease: "Power1",
                    getEnd: (target: Piece, key: string, value: number) => {
                        if (this.currentPiece.direction !== Direction.DOWN) {
                            return value
                        }

                        const touchingLeft = this.currentPiece.x <= BLOCK_SIZE + BLOCK_SIZE / 2
                        this.currentPiece.direction = touchingLeft ? Direction.RIGHT : Direction.LEFT

                        return value + BLOCK_SIZE
                    },
                    getStart: (target: Piece, key: string) => {
                        return target[key]
                    }
                }
            },
            repeat: -1,
            repeatDelay: 10,
            targets: this.currentPiece
        })
    }

    private getMoveDuration() {
        return clamp(1000 / (this.level / 1.5), 10, 600)
    }
}
