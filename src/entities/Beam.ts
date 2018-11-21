import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import Game from "../scenes/Game"

import { Piece } from "./Piece"

const log = debug("game:entities:Beam")

const BEAM_RESOURCES_TEXT = "Beam Resources: "
// TODO(tristan): Resources should probably get more scarce as the level goes up.
// Currently, as the level progresses such that tile movement is faster, you can easily never
// run out of beam resources
const BEAM_RESOURCE_GEN_DELTA = 200.0
const BEAM_RESOURCE_CONSUME_DELTA = 20.0
const BEAM_UPDATE_DELTA = 250.0
const BEAM_START = "beam-start"
const BEAM_FIRE = "beam-fire"
const BEAM_END = "beam-end"

export class Beam extends Phaser.GameObjects.Sprite {
    private game: Game
    private resourceConsumeDelta: number
    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text
    private updateDelta: number

    constructor(game: Game, x: number, y: number, startingResources: integer) {
        log("constructing")

        super(game, x, y, Assets.Beam)
        this.game = game
        this.setPosition(x, y - (this.scene.cameras.main.height / 2))
        this.setDisplaySize(this.width, this.scene.cameras.main.height)

        this.resourceConsumeDelta = 0.0
        this.resourceGenDelta = 0.0
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.game.add.text(
            this.game.cameras.main.width - 200,
            5,
            BEAM_RESOURCES_TEXT + this.resources
        )
        this.updateDelta = 0.0

        this.setVisible(false)
        this.setAlpha(0.75)

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 5,
                start: 0
            }),
            key: BEAM_START
        })

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 9,
                start: 6
            }),
            key: BEAM_FIRE,
            repeat: -1
        })

        this.scene.anims.create({
            frameRate: 24,
            frames: this.scene.anims.generateFrameNumbers(Assets.Beam, {
                end: 5,
                start: 0
            }),
            key: BEAM_END
        })

        this.on("animationcomplete", this.onAnimationComplete.bind(this))

        log("constructed")
    }

    public update(time: number, delta: number, beamActive: boolean, currentPiece?: Piece) {
        this.resourceGenDelta += delta
        this.resourceConsumeDelta += delta
        this.updateDelta += delta

        if (this.resourceGenDelta > BEAM_RESOURCE_GEN_DELTA) {
            this.resources = Math.min(this.resources + 1, this.resourceLimit)
            this.resourceGenDelta = 0.0
        }

        if (!isUndefined(currentPiece)) {
            if (beamActive) {
                if (!this.visible) {
                    this.setVisible(true)
                    this.anims.play(BEAM_START, true)
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

                if (this.visible && this.anims.currentAnim && this.anims.currentAnim.key === BEAM_FIRE) {
                    this.anims.stop()
                    this.anims.playReverse(BEAM_END, true)
                }
            }
        }

        this.resourcesText.text = BEAM_RESOURCES_TEXT + this.resources

        super.update(time, delta)
        this.anims.update(time, delta)
    }

    private beam(piece: Piece) {
        if (!piece.isBeingBeamed()) {
            log("beam started")
            piece.setBeingBeamed(true)
        }

        if (this.updateDelta > BEAM_UPDATE_DELTA) {
            this.updateDelta = 0.0
        }
    }

    private canBeam(piece: Piece): boolean {
        if (this.resources <= 0) {
            return false
        }

        if (this.resourceConsumeDelta > BEAM_RESOURCE_CONSUME_DELTA) {
            this.resources--
            this.resourceConsumeDelta = 0.0
        }

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
    }

    private onAnimationComplete(currentAnimation: Phaser.Animations.Animation) {
        if (currentAnimation.key === BEAM_START && this.visible) {
            this.anims.play(BEAM_FIRE)
        } else if (currentAnimation.key === BEAM_END && this.visible) {
            this.setVisible(false)
        }
    }
}
