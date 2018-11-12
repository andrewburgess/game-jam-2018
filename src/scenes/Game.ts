import * as debug from "debug"
import { each, range } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE } from "../entities/Block"
import { BOARD_HEIGHT, BOARD_WIDTH, Board } from "../entities/Board"
import { Piece, Shape, createPiece } from "../entities/Piece"

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

        setTimeout(() => {
            this.activateNextPiece()
        }, 1500)
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
            throw new Error("no next piece?")
        }

        this.currentPiece = this.nextPiece
        if (!this.board.canPieceMoveTo(this.currentPiece, 0, 0)) {
            // The player loses!
            log("you loser")
            throw new Error("loser loser loser")
        }

        this.currentPiece.onActivate()
    }

    private spawnNextPiece() {
        log("spawn next piece")

        this.nextPiece = createPiece(this, BLOCK_SIZE, BLOCK_SIZE, {
            level: this.level,
            shape: list.length > 0 ? list.shift() : undefined
        })
        this.add.existing(this.nextPiece)
    }

    private drawBoard() {
        each(range(BOARD_WIDTH + 1), (x) =>
            this.add.line(
                BLOCK_SIZE / 2,
                this.cameras.main.height / 2,
                x * BLOCK_SIZE,
                BLOCK_SIZE * 2,
                x * BLOCK_SIZE,
                this.cameras.main.height - BLOCK_SIZE,
                0x0000ff,
                0.3
            )
        )
        each(range(BOARD_HEIGHT + 1), (y) =>
            this.add.line(
                this.cameras.main.width / 2,
                0,
                0,
                BLOCK_SIZE * 3 + BLOCK_SIZE / 2 + y * BLOCK_SIZE,
                this.cameras.main.width,
                BLOCK_SIZE * 3 + BLOCK_SIZE / 2 + y * BLOCK_SIZE,
                0xff0000,
                0.3
            )
        )
    }
}
