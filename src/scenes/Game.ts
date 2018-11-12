import * as debug from "debug"
import { each, range } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE } from "../entities/Block"
import { Board, BOARD_WIDTH, BOARD_HEIGHT } from "../entities/Board"
import { Piece, createPiece } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

export interface IGameInitialization {
    level: number
}

export default class Game extends Phaser.Scene {
    private board: Board

    /**
     * The currently falling piece.
     *
     * @private
     * @type {Piece}
     * @memberof Game
     */
    private currentPiece?: Piece

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

        this.board = new Board()
        this.level = config.level

        if (window.localStorage && window.localStorage.getItem("debug")) {
            this.drawBoard()
        }

        this.spawnNextPiece()
    }

    public getLevel() {
        return this.level
    }

    public update(time: number, delta: number) {
        if (!this.currentPiece) {
            return
        }

        this.currentPiece.update(time, delta)
    }

    private activateNextPiece() {
        log("activate next piece")

        if (!this.nextPiece) {
            throw new Error("no next piece?")
        }

        this.currentPiece = this.nextPiece
        if (!this.board.canPieceMoveTo(this.currentPiece, 0, 0)) {
            // The player loses!
            log("you loser")
            throw new Error("loser loser loser")
        }

        this.currentPiece.onActivate()

        setTimeout(() => {
            this.spawnNextPiece()
        }, 1000)
    }

    private spawnNextPiece() {
        log("spawn next piece")

        this.nextPiece = createPiece(this, BLOCK_SIZE, BLOCK_SIZE, {
            level: this.level
        })
        this.add.existing(this.nextPiece)
    }

    private drawBoard() {
        each(range(BOARD_WIDTH), (x) =>
            this.add.line(
                BLOCK_SIZE / 2,
                this.cameras.main.height / 2,
                x * BLOCK_SIZE,
                0,
                x * BLOCK_SIZE,
                this.cameras.main.height,
                0xff0000,
                0.3
            )
        )
        each(range(BOARD_HEIGHT), (y) =>
            this.add.line(
                this.cameras.main.width / 2,
                BLOCK_SIZE / 2,
                0,
                y * BLOCK_SIZE,
                this.cameras.main.width,
                y * BLOCK_SIZE,
                0xff0000,
                0.3
            )
        )
    }
}
