import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { SoundGroup } from "../SoundGroup"
import { Assets } from "../assets"
import { BLOCK_SIZE } from "../entities/Block"
import { Board } from "../entities/Board"
import { Data } from "../entities/Data"
import { Piece, Shape, createPiece } from "../entities/Piece/"
import { Player } from "../entities/Player"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Game}`)

const list: Shape[] = []
const PIECE_PRICE = 500

export interface IGameInitialization {
    level: number
}

export default class Game extends Phaser.Scene {
    public board: Board
    public fxSounds: SoundGroup
    public musicSounds: SoundGroup

    private config: IGameInitialization

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
                    debug: false
                }
            }
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log(`create level ${config.level}`)

        this.config = config
        this.level = Levels[config.level]

        this.registry.set(Data.BUDGET, this.level.budget)

        this.cameras.main.setZoom(this.level.zoom)
        this.events.on("resume", () => {
            log(`fx volume on resume: ${this.fxSounds.getVolume()}`)
            log(`music volume on resume: ${this.musicSounds.getVolume()}`)
            log(`global mute on resume: ${this.fxSounds.isMuted()}`)
            this.cameras.main.fadeIn(500, 0, 0, 0)
        })

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

        this.sound.volume = 1
        this.fxSounds = new SoundGroup(this)
        this.musicSounds = new SoundGroup(this)
        this.fxSounds.add(Assets.FxBeamActivated)
        this.fxSounds.add(Assets.FxBeamBeamingPiece)
        this.fxSounds.add(Assets.FxPieceHit)
        this.fxSounds.add(Assets.FxProjectileFired)
        this.musicSounds.add(Assets.Music01)
        this.musicSounds.add(Assets.Music02)

        let volumeSettingsRaw: any = null
        try {
            volumeSettingsRaw = window.localStorage.getItem(Data.VOLUME)
        } catch (e) {
            console.warn(
                "You seem to have third party cookies and site data blocked. Can't save anything unfortunately"
            )
        }
        const volumeSettings: VolumeSettings = {
            fxSounds: 1,
            musicSounds: 0.8,
            muted: false
        }
        if (volumeSettingsRaw) {
            const parsed = JSON.parse(volumeSettingsRaw) as VolumeSettings
            volumeSettings.fxSounds = parsed.fxSounds
            volumeSettings.musicSounds = parsed.musicSounds
            volumeSettings.muted = parsed.muted
        }

        this.fxSounds.setVolume(volumeSettings.fxSounds)
        this.musicSounds.setVolume(volumeSettings.musicSounds)
        this.fxSounds.setMuted(volumeSettings.muted)
        this.musicSounds.setMuted(volumeSettings.muted)
        this.musicSounds.loopAllSounds()

        this.add.existing(this.board)

        this.scene.launch(Scenes.LevelStart, {
            level: config.level
        })
    }

    public update(time: number, delta: number) {
        super.update(time, delta)

        if ((this.nextPiece || this.currentPiece) && this.controller.settings!.isUniquelyDown()) {
            log("launching game settings scene")
            this.cameras.main.fade(200, 0, 0, 0)
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.launch(Scenes.GameSettings, { fxSounds: this.fxSounds, musicSounds: this.musicSounds })
                this.scene.pause()
            })
        }

        if (!this.currentPiece) {
            return
        }

        this.player.update(time, delta, this.currentPiece!)
    }

    public begin() {
        this.scene.launch(Scenes.GameUI, {
            level: this.config.level
        } as IGameInitialization)

        const boardHeight = this.level.height * BLOCK_SIZE
        const boardWidth = this.level.width * BLOCK_SIZE
        this.player = new Player(this, boardWidth / 2, boardHeight + 40)
        this.board.add(this.player)

        this.spawnNextPiece()

        setTimeout(() => {
            this.activateNextPiece()
        }, 1500)
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
            setTimeout(() => {
                this.scene.pause()
                this.scene.stop(Scenes.GameUI)
                this.scene.launch(Scenes.LevelComplete, {
                    level: this.config.level
                })
            }, 1000)
        }
    }

    private activateNextPiece() {
        log("activate next piece")

        if (!this.nextPiece) {
            throw new Error("no next piece?")
        }

        this.currentPiece = this.nextPiece
        const newBudget = (this.registry.get(Data.BUDGET) as number) - PIECE_PRICE

        this.nextPiece = undefined
        if (
            newBudget < 0 ||
            !this.board.canPieceMoveTo(this.currentPiece, this.currentPiece.location.x, this.currentPiece.location.y)
        ) {
            log("you loser")
            setTimeout(() => {
                this.scene.pause()
                this.scene.stop(Scenes.GameUI)
                this.scene.launch(Scenes.LevelFail, {
                    level: this.config.level
                })
            }, 1000)
        }

        this.registry.set(Data.BUDGET, newBudget)
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
        this.board.moveTo(this.nextPiece, 0) // Ensure next piece is at the bottom of the draw stack
    }
}
