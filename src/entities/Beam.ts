import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { Piece } from "../entities/Piece"

const log = debug("game:entities:Beam")

const BEAM_RESOURCES_TEXT = "Beam Resources: "
const BEAM_RESOURCE_GEN_DELTA = 250.0
const BEAM_RESOURCE_CONSUME_DELTA = 75.0
const BEAM_UPDATE_DELTA = 250.0

export class Beam extends Phaser.GameObjects.Sprite {
    public scene: Phaser.Scene
    private resourceConsumeDelta: number
    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text
    private updateDelta: number

    constructor(scene: Phaser.Scene, x: number, y: number, startingResources: number) {
        log("constructing")

        super(scene, x, y, Assets.Beam)
        this.scene = scene

        this.resourceConsumeDelta = 0.0
        this.resourceGenDelta = 0.0
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.scene.add.text(
            this.scene.cameras.main.width - 200,
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
                    this.beam(currentPiece)
                } else {
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

        log(`tristan test: ${this.x}, ${this.width}, ${this.y}, ${this.height}, ${piece.x}, ${piece.y}`)

        const pieceWithinBeamBounds: boolean =
            piece.x >= this.parentContainer.x + this.leftEdgeXOffset() &&
            piece.x <= this.parentContainer.x + this.rightEdgeXOffset()

        return pieceWithinBeamBounds
    }

    private leftEdgeXOffset() {
        return -this.width / 2
    }

    private rightEdgeXOffset() {
        return this.width / 2
    }
}
