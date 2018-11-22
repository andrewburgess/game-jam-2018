import * as debug from "debug"
import { some } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { ILevel } from "../levels"
import Game from "../scenes/Game"

import { BLOCK_SIZE } from "./Block"
import { Data } from "./Data"
import { Piece } from "./Piece"

const log = debug("game:entities:Beam")

const BEAM_END_ANIMATION = "beam-end"
const BEAM_FIRE_ANIMATION = "beam-fire"
const BEAM_START_ANIMATION = "beam-start"

export class Beam extends Phaser.GameObjects.Sprite {
    private firing: boolean
    private game: Game
    private level: ILevel

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, Assets.Beam)

        this.game = game
        this.setPosition(x, y - this.scene.cameras.main.height / 2)
        this.setDisplaySize(this.width, this.scene.cameras.main.height)

        this.setVisible(false)
        this.setAlpha(0.75)

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 5,
                start: 0
            }),
            key: BEAM_START_ANIMATION
        })

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 9,
                start: 6
            }),
            key: BEAM_FIRE_ANIMATION,
            repeat: -1
        })

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 5,
                start: 0
            }),
            key: BEAM_END_ANIMATION
        })

        this.on("animationcomplete", this.onAnimationComplete.bind(this))

        // Initialize game data
        this.level = this.game.getLevel()
        this.scene.registry.set(Data.BEAM_CURRENT, this.level.beam.maximum)
        this.scene.registry.set(Data.BEAM_MAX, this.level.beam.maximum)

        this.firing = false

        log("constructed")
    }

    public fire() {
        log("firing")
        this.setVisible(false)
        this.firing = false
        this.anims.stop()

        this.firing = true
        this.setVisible(true)
        this.anims.play(BEAM_START_ANIMATION)
    }

    public isFiring() {
        return this.firing
    }

    public stopFiring() {
        log("stop firing")

        this.firing = false
        this.anims.playReverse(BEAM_END_ANIMATION)
    }

    public update(time: number, delta: number) {
        super.update(time, delta)
        this.anims.update(time, delta)

        if (this.firing) {
            this.fireBeam(delta)
        } else {
            this.regenerateBeam(delta)
        }
    }

    /*public update(time: number, delta: number, beamActive: boolean, currentPiece?: Piece) {
        if (!isUndefined(currentPiece)) {
            if (beamActive) {
                if (!this.visible) {
                    this.setVisible(true)
                    this.anims.play(BEAM_START_ANIMATION, true)
                }

                if (this.canBeam(currentPiece)) {
                    this.game.sound.play(Assets.FxBeamBeamingPiece, { volume: 0.75 })
                    this.beam(currentPiece)
                } else {
                    this.scene.sound.play(Assets.FxBeamActivated, { volume: 0.55 })
                    if (currentPiece.isBeingBeamed()) {
                        log("beam finished")
                        currentPiece.setBeingBeamed(false)
                    }
                }
            } else {
                if (currentPiece.isBeingBeamed()) {
                    currentPiece.setBeingBeamed(false)
                }

                if (this.visible && this.anims.currentAnim && this.anims.currentAnim.key === BEAM_FIRE_ANIMATION) {
                    this.anims.stop()
                    this.anims.playReverse(BEAM_END_ANIMATION, true)
                }
            }
        }

        super.update(time, delta)
        this.anims.update(time, delta)
    }*/

    private beam(piece: Piece) {
        if (!piece.isBeingBeamed()) {
            log("beam started")
            piece.setBeingBeamed(true)
        }
    }

    /*private canBeam(piece: Piece): boolean {
        const pieceRelLeft = new Phaser.Math.Vector2(piece.x - piece.width / 2, piece.y - piece.height)
        const pieceWorldLeft = this.game.board.canonicalizePosition(pieceRelLeft)

        const pieceRelCenter = new Phaser.Math.Vector2(piece.x, piece.y - piece.height)
        const pieceWorldCenter = this.game.board.canonicalizePosition(pieceRelCenter)

        const pieceRelRight = new Phaser.Math.Vector2(piece.x + piece.width / 2, piece.y - piece.height)
        const pieceWorldRight = this.game.board.canonicalizePosition(pieceRelRight)

        return (
            this.parentContainer.body.hitTest(pieceWorldLeft.x, this.parentContainer.y) ||
            this.parentContainer.body.hitTest(pieceWorldCenter.x, this.parentContainer.y) ||
            this.parentContainer.body.hitTest(pieceWorldRight.x, this.parentContainer.y)
        )
    }*/

    private consumeBeam(delta: number) {
        let current: number = this.game.registry.get(Data.BEAM_CURRENT)
        current = Math.max(current - (this.level.beam.consumptionRate / 1000) * delta, 0)

        this.game.registry.set(Data.BEAM_CURRENT, current)
    }

    private fireBeam(delta: number) {
        const beamResource = this.game.registry.get(Data.BEAM_CURRENT)
        if (beamResource > 0) {
            this.consumeBeam(delta)

            const pieceHit = this.isBeamHittingPiece()
            log(`piece hit ${pieceHit}`)
            this.game.sound.play(Assets.FxBeamActivated, { volume: 0.55 })
        } else {
            this.stopFiring()
        }
    }

    private isBeamHittingPiece() {
        const piece = this.game.getCurrentPiece()
        if (!piece) {
            return false
        }

        const blockLocations = piece.getBlockLocations()
        const beamLeft = this.x - this.width / 2
        const beamRight = this.x + this.width / 2
        return some(blockLocations, (vec: Vector2Like) => {
            const vecLeft = vec.x * BLOCK_SIZE
            const vecRight = vec.x * BLOCK_SIZE + BLOCK_SIZE

            return vecLeft >= beamLeft && vecRight <= beamRight
        })
    }

    private onAnimationComplete(currentAnimation?: Phaser.Animations.Animation) {
        if (!currentAnimation) {
            return
        }

        if (currentAnimation.key === BEAM_START_ANIMATION && this.isFiring()) {
            this.anims.play(BEAM_FIRE_ANIMATION)
        } else if (currentAnimation.key === BEAM_END_ANIMATION && this.visible) {
            this.setVisible(false)
        }
    }

    private regenerateBeam(delta: number) {
        if (this.isFiring()) {
            return
        }

        let current: number = this.game.registry.get(Data.BEAM_CURRENT)
        current = Math.min(current + (this.level.beam.regenerationRate / 1000) * delta, this.level.beam.maximum)
        this.game.registry.set(Data.BEAM_CURRENT, current)
    }
}
