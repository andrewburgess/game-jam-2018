import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { Piece } from "../entities/Piece"

import { Player } from "./Player"

const log = debug("game:entities:Beam")

const BEAM_RESOURCES_TEXT = "Beam Resources: "
const BEAM_RESOURCE_GEN_DELTA = 250.0
const BEAM_RESOURCE_CONSUME_DELTA = 100.0
const BEAM_UPDATE_DELTA = 250.0

export class Beam extends Phaser.GameObjects.Sprite {
    public scene: Phaser.Scene
    private player: Player
    private resourceConsumeDelta: number
    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text
    private updateDelta: number

    constructor(scene: Phaser.Scene, player: Player, startingResources: number) {
        log("constructing")

        // TODO(tristan): make semi-transparent blue cone sprite texture to represent the beam
        super(scene, player.x, player.y, Assets.Beam)
        this.scene = scene

        this.player = player
        this.resourceConsumeDelta = 0.0
        this.resourceGenDelta = 0.0
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.scene.add.text(
            this.scene.cameras.main.width - 200,
            5,
            BEAM_RESOURCES_TEXT + this.resources
        )
        this.updateDelta = 0.0

        this.setY(this.y - player.height - this.height)

        this.scene.add.existing(this)
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

        this.updateBeamPosition()

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
                        currentPiece.resumeMove()
                    }
                }
            } else {
                this.setVisible(false)
                if (currentPiece.isBeingBeamed()) {
                    currentPiece.setBeingBeamed(false)
                    currentPiece.resumeMove()
                }
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
            piece.beam()
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

        if (piece && piece.x <= this.x + this.width && piece.x >= this.x - this.width) {
            return true
            // TODO(tristan): https://answers.unity.com/questions/760532/how-to-warpdistort-a-2d-sprite.html
            // Warp space in front of beam into cone-ish shape to look like the beam is coming out of the ship
        } else {
            return false
        }
    }

    private updateBeamPosition() {
        const beamPosX: number = this.player.x
        const beamPosY: number = this.player.y - this.player.height / 2 - this.height
        this.setPosition(beamPosX, beamPosY)
    }
}
