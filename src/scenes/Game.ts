import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { BLOCK_SIZE } from "../entities/Block"
import { Board } from "../entities/Board"
import { Piece, RotateDirection, Shape, createPiece } from "../entities/Piece/"
import { Player } from "../entities/Player"

import { Assets } from "../assets"

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

    /**
     * The player of the game
     *
     * @private
     * @type {Player}
     * @memberof Game
     */
    private player: Player

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

        this.add.image(this.centerX(), this.centerY(), Assets.Background)

        this.player = new Player(this, this.centerX(), this.cameras.main.height)

        const worldTop: Phaser.Physics.Arcade.Sprite = this.physics.add.staticSprite(16, -16, "world_top")
        worldTop.setSize(this.physics.world.bounds.width, worldTop.height)
        this.player.projectiles.destroyOnCollisionWith(worldTop)

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

        this.player.update(time, delta, this.currentPiece!)

        if (this.controller.space!.isDown() && !this.currentPiece.isRotating()) {
            this.currentPiece.rotate(RotateDirection.CLOCKWISE)
        }
    }

    public getLevel() {
        return this.level
    }

    public onPieceActivated() {
        // NOTE(tristan): Assumes we only want one piece spawned at any given time
        if (isUndefined(this.nextPiece)) {
            this.spawnNextPiece()
        }
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
        this.nextPiece = undefined
        if (!this.board.canPieceMoveTo(this.currentPiece, this.currentPiece.location.x, this.currentPiece.location.y)) {
            // The player loses!
            log("you loser")
            throw new Error("loser loser loser")
        }

        this.currentPiece.onActivate()
    }

    private centerX() {
        return this.cameras.main.width / 2
    }

    private centerY() {
        return this.cameras.main.height / 2
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
