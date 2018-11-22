import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { BLOCK_SIZE } from "../entities/Block"
import { Board } from "../entities/Board"
import { Piece, Shape, createPiece } from "../entities/Piece/"
import { Player } from "../entities/Player"

import { Assets } from "../assets"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

const list: Shape[] = []

export interface IGameInitialization {
    level: number
}

export default class Game extends Phaser.Scene {
    public board: Board

    /**
     * The virtual controller that maps physical device actions into game actions.
     *
     * @private
     * @type {UnifiedController}
     * @memberof Game
     */
    private controller: UnifiedController

    /**
     * The currently falling piece.
     *
     * @private
     * @type {Piece}
     * @memberof Game
     */
    private currentPiece?: Piece

    /**
     * The level configuration of the game
     *
     * @private
     * @type {ILevel}
     * @memberof Game
     */
    private level: ILevel

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
                    debug: !!window.localStorage.debug,
                    gravity: { y: 300 }
                }
            }
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log(`create level ${config.level}`)

        this.level = Levels[config.level]

        this.cameras.main.setZoom(this.level.zoom)

        const boardHeight = this.level.height * BLOCK_SIZE
        const boardWidth = this.level.width * BLOCK_SIZE
        this.board = new Board(
            this,
            this.cameras.main.centerX - (boardWidth - BLOCK_SIZE) / 2,
            this.cameras.main.centerY - boardHeight / 2,
            this.level
        )
        this.controller = new UnifiedController(this.input)

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, Assets.Background)

        const music01 = this.sound.add(Assets.Music01, { volume: 0.05 })
        const music02 = this.sound.add(Assets.Music02, { volume: 0.05 })
        music01.on("ended", () => {
            music02.play()
        })
        music02.on("ended", () => {
            music01.play()
        })
        music01.play()

        this.add.existing(this.board)

        this.player = new Player(this, boardWidth / 2, boardHeight + 40)
        this.board.add(this.player)

        const worldTop: Phaser.Physics.Arcade.Sprite = this.physics.add.staticSprite(16, -16, "world_top")
        worldTop.setSize(this.physics.world.bounds.width, worldTop.height)
        this.player.projectiles.destroyOnCollisionWith(worldTop)

        this.spawnNextPiece()

        setTimeout(() => {
            this.activateNextPiece()
        }, 1500)
    }

    public update(time: number, delta: number) {
        super.update(time, delta)

        if (this.controller.settings!.isUniquelyDown()) {
            log("launching game settings scene")
            this.scene.launch(Scenes.GameSettings)
            this.scene.pause()
        }

        if (!this.currentPiece) {
            return
        }

        this.player.update(time, delta, this.currentPiece!)
    }

    public getCurrentPiece() {
        return this.currentPiece
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
        if (!this.board.isComplete()) {
            this.activateNextPiece()
        } else {
            log("you winner")
            throw new Error("winner winner winner")
        }
    }

    private activateNextPiece() {
        log("activate next piece")

        if (!this.nextPiece) {
            throw new Error("no next piece?")
        }

        this.currentPiece = this.nextPiece

        // Make sure the player is on top of all of the blocks so the beam
        // overlaps them
        this.board.moveTo(this.player, this.board.getIndex(this.currentPiece))
        this.nextPiece = undefined
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
