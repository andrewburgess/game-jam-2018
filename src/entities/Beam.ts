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
                this.setVisible(false)
            }
        }

        this.resourcesText.text = BEAM_RESOURCES_TEXT + this.resources
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
}
