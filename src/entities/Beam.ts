import * as debug from "debug"
import { map, max, min } from "lodash"
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
        this.setPosition(x + 2, y - this.scene.cameras.main.height / 2)
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

        const currentPiece = this.game.getCurrentPiece()
        if (currentPiece && currentPiece.isBeingBeamed()) {
            currentPiece.setBeingBeamed(false)
        }

        this.game.fxSounds.get(Assets.FxBeamBeamingPiece).stop()
        this.game.fxSounds.get(Assets.FxBeamActivated).stop()

        this.firing = false
        this.anims.playReverse(BEAM_END_ANIMATION)
    }

    public update(time: number, delta: number) {
        if (!this.active) {
            return
        }

        super.update(time, delta)
        this.anims.update(time, delta)

        if (this.firing) {
            this.fireBeam(delta)
        } else {
            this.regenerateBeam(delta)
        }
    }

    private consumeBeam(delta: number) {
        let current: number = this.game.registry.get(Data.BEAM_CURRENT)
        current = Math.max(current - (this.level.beam.consumptionRate / 1000) * delta, 0)

        this.game.registry.set(Data.BEAM_CURRENT, current)
    }

    private fireBeam(delta: number) {
        const beamResource = this.game.registry.get(Data.BEAM_CURRENT)

        const currentPiece = this.game.getCurrentPiece()

        if (beamResource > 0 && currentPiece) {
            this.consumeBeam(delta)

            if (this.isBeamHittingPiece(currentPiece)) {
                if (!this.game.fxSounds.get(Assets.FxBeamBeamingPiece).isPlaying) {
                    this.game.fxSounds.get(Assets.FxBeamBeamingPiece).play(undefined, { loop: true })
                }
                currentPiece.setBeingBeamed(
                    true,
                    this.getBeamCenter() - this.width / 4,
                    this.getBeamCenter() + this.width / 4
                )
            } else {
                if (!this.game.fxSounds.get(Assets.FxBeamActivated).isPlaying) {
                    this.game.fxSounds.get(Assets.FxBeamActivated).play(undefined, { loop: true })
                }
                currentPiece.setBeingBeamed(false)
            }
        } else {
            this.stopFiring()
        }
    }

    private getBeamCenter() {
        const container = this.parentContainer
        return container.x + this.x
    }

    private isBeamHittingPiece(piece: Piece) {
        const beamCenter = this.getBeamCenter()
        const blocks = piece.getBlockLocations()
        const lefts = map(blocks, (block) => piece.x + block.x * BLOCK_SIZE)
        const rights = map(blocks, (block) => piece.x + block.x * BLOCK_SIZE + BLOCK_SIZE)

        return beamCenter + this.width / 4 >= min(lefts)! && beamCenter - this.width / 4 <= max(rights)!
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
