import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { BLOCK_SIZE } from "../entities/Block"
import { Board } from "../entities/Board"
import { Direction, Piece, RotateDirection, Shape, createPiece } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

const list: Shape[] = []

export interface IGameInitialization {
    level: number
}

export default class Game extends Phaser.Scene {
    public board: Board

    /**
     * The currently falling piece.
     * NOTE(tristan): protected for now while we have dev scenes that derive from Game
     *
     * @protected
     * @type {Piece}
     * @memberof Game
     */
    protected currentPiece?: Piece

    private controller: UnifiedController

    /**
     * The level number (at least 1), which influences how fast pieces move
     *
     * @private
     * @type {number}
     * @memberof Game
     */
    private level: number

    /**
     * The next piece to spawn
     *
     * @private
     * @type {Piece}
     * @memberof Game
     */
    private nextPiece?: Piece

    constructor(inKey: string = Scenes.Game) {
        super({
            key: inKey,
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 300 }
                }
            }
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log(`create level ${config.level}`)

        this.board = new Board(this, BLOCK_SIZE, BLOCK_SIZE * 4)
        this.level = config.level
        this.controller = new UnifiedController(this.input)

        this.add.existing(this.board)

        if (window.localStorage && window.localStorage.getItem("debug")) {
            this.board.drawBoard()
        }

        this.spawnNextPiece()

        setTimeout(() => {
            this.activateNextPiece()
        }, 1500)
    }

    public update(time: number, delta: number) {
        if (!this.currentPiece) {
            return
        }

        if (this.controller.space!.isDown() && !this.currentPiece.isRotating()) {
            this.currentPiece.rotate(RotateDirection.CLOCKWISE)
        }
    }

    public getLevel() {
        return this.level
    }

    public onPieceActivated() {
        this.spawnNextPiece()
    }

    public onPieceSettled() {
        this.activateNextPiece()
    }

    private activateNextPiece() {
        log("activate next piece")

        if (!this.nextPiece) {
            throw new Error("nso next piece?")
        }

        this.currentPiece = this.nextPiece
        if (!this.board.canPieceMoveTo(this.currentPiece, this.currentPiece.location.x, this.currentPiece.location.y)) {
            // The player loses!
            log("you loser")
            throw new Error("loser loser loser")
        }

        this.currentPiece.onActivate()
    }

    private spawnNextPiece() {
        log("spawn next piece")

        this.nextPiece = createPiece(this, 0, -3 * BLOCK_SIZE, {
            level: this.level,
            shape: list.length > 0 ? list.shift() : undefined
        })
        this.nextPiece.setPosition(
            this.nextPiece.location.x * BLOCK_SIZE,
            this.nextPiece.location.y * BLOCK_SIZE + -3 * BLOCK_SIZE
        )
        this.board.add(this.nextPiece)
    }
}
